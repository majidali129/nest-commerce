import { Product } from "src/products/product.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({name: 'product_categories'})
export class ProductCategory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type: 'varchar', length: 255, nullable: false})
    name!: string;

    @Column({type: 'varchar', length: 255, nullable: false, unique: true})
    slug!: string;

    @Column({type: 'text', nullable: false})
    description!: string;

    @Column({type: 'varchar', length: 255, nullable: true, name: 'image_url'})
    imageUrl!: string | null;

    @Column({type: 'int', nullable: false, default: 0, name: 'product_count'})
    productsCount!: number;

    @OneToMany(() => Product, (product) => product.category)
    products!: Product[];

    @CreateDateColumn({nullable: false})
    createdAt!: Date;

    @UpdateDateColumn({nullable: false})
    updatedAt!: Date;

    @DeleteDateColumn({nullable: true})
    deletedAt!: Date | null;

}