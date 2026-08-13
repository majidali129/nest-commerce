import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PRODUCT_CATEGORY_REPOSITORY } from './constants';
import { Repository } from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { CategoriesQueryDto } from './dtos/categories-query.dto';
import slugify from 'slugify';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @Inject(PRODUCT_CATEGORY_REPOSITORY)
    private productCategoryRepo: Repository<ProductCategory>,
  ) {}

  async findAll(query: CategoriesQueryDto = {}) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 12, 100);
    const skip = (page - 1) * limit;
    const sort = query.sort ?? 'newest';

    const qb = this.productCategoryRepo.createQueryBuilder('category');

    if (query.q?.trim()) {
      const q = `%${query.q.trim()}%`;
      qb.andWhere(
        '(category.name ILIKE :q OR category.slug ILIKE :q OR category.description ILIKE :q)',
        { q },
      );
    }

    switch (sort) {
      case 'name-asc':
        qb.orderBy('category.name', 'ASC');
        break;
      case 'name-desc':
        qb.orderBy('category.name', 'DESC');
        break;
      case 'products-asc':
        qb.orderBy('category.productsCount', 'ASC');
        break;
      case 'products-desc':
        qb.orderBy('category.productsCount', 'DESC');
        break;
      case 'newest':
      default:
        qb.orderBy('category.createdAt', 'DESC');
        break;
    }
    qb.addOrderBy('category.id', 'DESC');

    const [items, total] = await qb.skip(skip).take(limit).getManyAndCount();

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

  async findOne(id: number) {
    const category = await this.productCategoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.productCategoryRepo.exists({
      where: { name: createCategoryDto.name },
    });
    if (existingCategory) {
      throw new BadRequestException('Category with this name already exists');
    }

    const category = this.productCategoryRepo.create({
      ...createCategoryDto,
      slug: slugify(createCategoryDto.name.trim().toLowerCase(), { lower: true }),
    });
    const savedCategory = await this.productCategoryRepo.save(category);

    if (!savedCategory) {
      throw new InternalServerErrorException('Failed to create category');
    }
    return savedCategory;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.productCategoryRepo.preload({ id, ...dto });
    if (!category) {
      throw new NotFoundException('Category not found or has been deleted');
    }
    if (dto.name) {
      category.slug = slugify(dto.name.trim().toLowerCase(), { lower: true });
    }
    const updatedCategory = await this.productCategoryRepo.save(category);
    if (!updatedCategory) {
      throw new InternalServerErrorException('Failed to update category');
    }
    return updatedCategory;
  }

  async incrementProductsCount(id: number, by = 1) {
    const result = await this.productCategoryRepo.increment({ id }, 'productsCount', by);
    if (!result.affected) {
      throw new NotFoundException('Category not found or has been deleted');
    }
  }

  async decrementProductsCount(id: number, by = 1) {
    const category = await this.productCategoryRepo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found or has been deleted');
    }
    category.productsCount = Math.max(0, category.productsCount - Number(by));
    await this.productCategoryRepo.save(category);
  }

  async delete(id: number) {
    const category = await this.findOne(id);
    if (category.productsCount > 0) {
      throw new BadRequestException(
        'Cannot delete category while it still has products. Move or delete products first.',
      );
    }
    await this.productCategoryRepo.softDelete(id);
    return category;
  }
}
