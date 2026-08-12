import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PublicationStatus } from "./constants";
import { ProductCategory } from "../product-categories/product-category.entity";
import { ProductVariant } from "src/product-variants/product-variant.entity";



@Entity({ name: 'products' })
export class Product {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name!: string;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    slug!: string;

    @Column({ type: 'text', nullable: false, name: 'short_description' })
    shortDescription!: string;

    @Column({ type: 'text', nullable: false, name: 'description' })
    description!: string;

    @Column({ type: 'enum', enum: PublicationStatus, nullable: false, default: PublicationStatus.DRAFT })
    publicationStatus!: PublicationStatus;

    @Column({ type: 'boolean', nullable: false, default: false, name: 'is_featured' })
    isFeatured!: boolean;

    @Column({type: 'int', nullable: false, name: 'category_id'})
    categoryId!: number;

    @ManyToOne(() => ProductCategory, (category) => category.products, {onDelete: "RESTRICT"})
    @JoinColumn({name: 'category_id'})
    category!: ProductCategory
    

    @OneToMany(() => ProductVariant, variant => variant.product)
    variants!: ProductVariant[];

    @CreateDateColumn({ nullable: false })
    createdAt!: Date;

    @UpdateDateColumn({ nullable: false })
    updatedAt!: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt!: Date | null;

}