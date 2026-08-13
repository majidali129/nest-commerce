import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Not, type FindOptionsWhere, Repository } from 'typeorm';
import { PRODUCT_VARIANT_REPOSITORY, VariantStatus } from './constants';
import { ProductVariant } from './product-variant.entity';
import { CreateVariantDto } from './dtos/create-variant.dto';
import { UpdateVariantDto } from './dtos/update-variant.dto';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class ProductVariantsService {
  constructor(
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private readonly variantRepo: Repository<ProductVariant>,
    private readonly productsService: ProductsService,
  ) {}

  async findAll() {
    return this.variantRepo.find({
      relations: {
        product: true,
      },
    });
  }

  async findOne(id: number) {
    const variant = await this.variantRepo.findOne({
      where: { id },
      relations: {
        product: true,
      },
    });
    if (!variant) {
      throw new NotFoundException('Variant not found or has been deleted');
    }
    return variant;
  }

  async findByProductId(productId: number) {
    await this.productsService.findOne(productId);
    return this.variantRepo.find({
      where: { productId },
      relations: {
        product: true,
      },
      order: { id: 'ASC' },
    });
  }

  private async clearDefaultForProduct(
    productId: number,
    exceptId?: number,
  ): Promise<void> {
    const where: FindOptionsWhere<ProductVariant> = {
      productId,
      isDefault: true,
    };
    if (exceptId != null) {
      where.id = Not(exceptId);
    }
    await this.variantRepo.update(where, { isDefault: false });
  }

  async create(dto: CreateVariantDto) {
    await this.productsService.findOne(dto.productId);

    const existingSku = await this.variantRepo.findOne({
      where: { sku: dto.sku.trim() },
    });
    if (existingSku) {
      throw new BadRequestException('Variant with this SKU already exists');
    }

    const existingCount = await this.variantRepo.count({
      where: { productId: dto.productId },
    });

    // First variant is always default; otherwise honor the flag.
    const makeDefault = existingCount === 0 ? true : Boolean(dto.isDefault);

    if (makeDefault) {
      await this.clearDefaultForProduct(dto.productId);
    }

    const variant = this.variantRepo.create({
      productId: dto.productId,
      price: dto.price,
      sku: dto.sku.trim(),
      stockOnHand: dto.stockOnHand ?? 0,
      reservedStock: 0,
      status: dto.status ?? VariantStatus.ACTIVE,
      discountPercentage: dto.discountPercentage ?? 0,
      attributes: dto.attributes ?? null,
      media: dto.media ?? null,
      isDefault: makeDefault,
    });

    const created = await this.variantRepo.save(variant);
    if (!created) {
      throw new InternalServerErrorException('Failed to create variant');
    }
    return created;
  }

  async update(id: number, dto: UpdateVariantDto) {
    const existing = await this.findOne(id);

    if (dto.sku) {
      const existingSku = await this.variantRepo.findOne({
        where: { sku: dto.sku.trim() },
      });
      if (existingSku && existingSku.id !== id) {
        throw new BadRequestException('Variant with this SKU already exists');
      }
    }

    if (dto.isDefault === false && existing.isDefault) {
      throw new BadRequestException(
        'Cannot unset the default variant. Mark another variant as default instead.',
      );
    }

    if (dto.isDefault === true) {
      await this.clearDefaultForProduct(existing.productId, id);
    }

    const variant = await this.variantRepo.preload({
      id,
      ...dto,
      ...(dto.sku ? { sku: dto.sku.trim() } : {}),
    });
    if (!variant) {
      throw new NotFoundException('Variant not found or has been deleted');
    }

    const updated = await this.variantRepo.save(variant);
    if (!updated) {
      throw new InternalServerErrorException('Failed to update variant');
    }
    return updated;
  }

  async delete(id: number) {
    const variant = await this.findOne(id);

    if (variant.isDefault) {
      const nextDefault = await this.variantRepo.findOne({
        where: { productId: variant.productId, id: Not(id) },
        order: { id: 'ASC' },
      });

      await this.variantRepo.softDelete(id);

      if (nextDefault) {
        await this.variantRepo.update(nextDefault.id, { isDefault: true });
      }
      return variant;
    }

    await this.variantRepo.softDelete(id);
    return variant;
  }
}
