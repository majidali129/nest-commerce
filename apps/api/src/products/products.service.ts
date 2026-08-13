import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PRODUCT_REPOSITORY } from './constants';
import { DataSource, In, Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import slugify from 'slugify';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductCategoriesService } from 'src/product-categories/product-categories.service';
import { DATA_SOURCE } from 'src/shared/constants';
import { ProductVariant } from 'src/product-variants/product-variant.entity';
import { ProductsQueryDto } from './dtos/products-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_REPOSITORY) private productRepo: Repository<Product>,
    @Inject(DATA_SOURCE) private readonly dataSource: DataSource,
    private productCategoriesService: ProductCategoriesService,
  ) {}

  async findAll(query: ProductsQueryDto = {}) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 12, 100);
    const skip = (page - 1) * limit;
    const sort = query.sort ?? 'newest';

    const idQb = this.productRepo
      .createQueryBuilder('product')
      .leftJoin(
        ProductVariant,
        'dv',
        'dv.productId = product.id AND dv.isDefault = true AND dv.deletedAt IS NULL',
      )
      .select('product.id', 'id');

    if (query.q?.trim()) {
      const q = `%${query.q.trim()}%`;
      idQb.andWhere(
        '(product.name ILIKE :q OR product.slug ILIKE :q OR dv.sku ILIKE :q)',
        { q },
      );
    }

    if (query.categoryId != null) {
      idQb.andWhere('product.categoryId = :categoryId', {
        categoryId: query.categoryId,
      });
    }

    if (query.publicationStatus) {
      idQb.andWhere('product.publicationStatus = :publicationStatus', {
        publicationStatus: query.publicationStatus,
      });
    }

    if (query.minPrice != null) {
      idQb.andWhere('dv.price >= :minPrice', { minPrice: query.minPrice });
    }

    if (query.maxPrice != null) {
      idQb.andWhere('dv.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    const stockExpr =
      '(COALESCE(dv.stockOnHand, 0) - COALESCE(dv.reservedStock, 0))';

    if (query.stockStatus) {
      if (query.stockStatus === 'out_of_stock') {
        idQb.andWhere(`${stockExpr} <= 0`);
      } else if (query.stockStatus === 'low_stock') {
        idQb.andWhere(`${stockExpr} > 0 AND ${stockExpr} <= 5`);
      } else {
        idQb.andWhere(`${stockExpr} > 5`);
      }
    }

    switch (sort) {
      case 'price-asc':
        idQb.orderBy('dv.price', 'ASC', 'NULLS LAST');
        break;
      case 'price-desc':
        idQb.orderBy('dv.price', 'DESC', 'NULLS LAST');
        break;
      case 'name-asc':
        idQb.orderBy('product.name', 'ASC');
        break;
      case 'name-desc':
        idQb.orderBy('product.name', 'DESC');
        break;
      case 'stock-asc':
        idQb.orderBy(stockExpr, 'ASC');
        break;
      case 'stock-desc':
        idQb.orderBy(stockExpr, 'DESC');
        break;
      case 'featured':
        idQb
          .orderBy('product.isFeatured', 'DESC')
          .addOrderBy('product.createdAt', 'DESC');
        break;
      case 'newest':
      default:
        idQb.orderBy('product.createdAt', 'DESC');
        break;
    }
    idQb.addOrderBy('product.id', 'DESC');

    const total = await idQb.clone().getCount();
    const rawIds = await idQb.offset(skip).limit(limit).getRawMany<{ id: number }>();
    const ids = rawIds.map((row) => Number(row.id)).filter(Boolean);

    if (ids.length === 0) {
      return {
        items: [],
        meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
      };
    }

    const products = await this.productRepo.find({
      where: { id: In(ids) },
      relations: { category: true, variants: true },
      order: { variants: { id: 'ASC' } },
    });

    const order = new Map(ids.map((id, index) => [id, index]));
    products.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));

    const items = products.map((p) => this.toListItem(p));
    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  private toListItem(p: Product) {
    const v = p.variants?.find((variant) => variant.isDefault) ?? p.variants?.[0];
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      publicationStatus: p.publicationStatus,
      isFeatured: p.isFeatured,
      category: {
        id: p.category.id,
        name: p.category.name,
      },
      variant: v
        ? {
            id: v.id,
            productId: p.id,
            discountPercentage: v.discountPercentage,
            status: v.status,
            sku: v.sku,
            stock: v.stockOnHand - v.reservedStock,
            price: v.price,
            media: v.media,
            isDefault: v.isDefault,
            attributes: v.attributes,
          }
        : null,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    };
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: {
        category: true,
        variants: true,
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found or has been deleted');
    }
    return product;
  }

  async create(dto: CreateProductDto) {
    const slug = slugify(dto.name.trim().toLowerCase(), { lower: true });
    const existingProduct = await this.productRepo.findOne({ where: { slug } });
    if (existingProduct) {
      throw new BadRequestException('Product with this name already exists');
    }

    const category = await this.productCategoriesService.findOne(dto.categoryId);

    const product = this.productRepo.create({
      ...dto,
      slug,
      categoryId: category.id,
    });
    const createdProduct = await this.productRepo.save(product);
    if (!createdProduct) {
      throw new InternalServerErrorException('Failed to create product');
    }

    await this.productCategoriesService.incrementProductsCount(category.id);

    return createdProduct;
  }

  async update(id: number, dto: UpdateProductDto) {
    const existing = await this.productRepo.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    const nextCategoryId = dto.categoryId;
    const categoryChanged =
      nextCategoryId !== undefined && nextCategoryId !== existing.categoryId;

    if (categoryChanged) {
      await this.productCategoriesService.findOne(nextCategoryId);
    }

    const product = await this.productRepo.preload({ id, ...dto });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (dto.name) {
      product.slug = slugify(dto.name.trim().toLowerCase(), { lower: true });
    }

    const updatedProduct = await this.productRepo.save(product);
    if (!updatedProduct) {
      throw new InternalServerErrorException('Failed to update product');
    }

    if (categoryChanged) {
      await this.productCategoriesService.decrementProductsCount(existing.categoryId);
      await this.productCategoriesService.incrementProductsCount(nextCategoryId);
    }

    return updatedProduct;
  }

  async delete(id: number) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found or has been deleted');
    }

    await this.productRepo.softDelete(id);
    await this.dataSource.getRepository(ProductVariant).softDelete({ productId: id });
    await this.productCategoriesService.decrementProductsCount(product.categoryId);

    return product;
  }
}
