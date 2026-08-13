import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { VariantStatus } from "./constants";
import { Product } from "src/products/product.entity";


@Entity({name: 'product_variants'})
export class ProductVariant {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'int', nullable: false})
    price!: number;

    @Column({type: 'enum', enum: VariantStatus, nullable: false, default: VariantStatus.ACTIVE})
    status!: VariantStatus;

    @Column({type: 'int', nullable: false, default: 0, name: 'stock_on_hand'})
    stockOnHand!: number;

    @Column({type: 'int', nullable: false, default: 0, name: 'reserved_stock'})
    reservedStock!: number;

    @Column({type: 'varchar', length: 255, nullable: false, unique: true})
    sku!: string;

    @Column({type: 'int', nullable: false, default: 0, name: 'discount_percentage'})
    discountPercentage!: number;

    @Column({type: 'boolean', nullable: false, default: false, name: 'is_default'})
    isDefault!: boolean;

    @Column({type: 'jsonb', nullable: true})
    attributes!: {
        size: string;
        color: string;
    } | null;

    @Column({type: 'jsonb', nullable: true})
    media!: {
        url: string;
        publicId: string;
        altText: string | null;
    } | null;

    @Column({type: 'int', nullable: false, name: 'product_id'})
    productId!: number;

    @ManyToOne(() => Product, product => product.variants, {onDelete: "CASCADE"})
    @JoinColumn({name: 'product_id'})
    product!: Product;

    @CreateDateColumn({nullable: false, name: 'created_at'})
    createdAt!: Date;

    @UpdateDateColumn({nullable: false, name: 'updated_at'})
    updatedAt!: Date;

    @DeleteDateColumn({nullable: true, name: 'deleted_at'})
    deletedAt!: Date | null;
}
