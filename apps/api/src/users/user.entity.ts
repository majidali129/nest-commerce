import { AccountStatus, UserRole } from "./constants";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('users')
export class User{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        nullable: false,
        length: 255,
        type: 'varchar',
    })
    name!: string;

    @Column({
        nullable: false,
        type: 'varchar',
        unique: true,
        length: 255,
    })
    email!: string;

    @Column({
        nullable: false,
        length: 255,
        type: 'varchar',
    })
    password!: string;

    @Column({
        nullable: true,
        length: 255,
        type: 'varchar',
        name: 'refresh_token',
    })
    refreshToken!: string | null;

    @Column({
        nullable: false,
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role!: UserRole;

    @Column({
        nullable: false,
        type: 'enum',
        enum: AccountStatus,
        default: AccountStatus.ACTIVE
    })
    accountStatus: AccountStatus = AccountStatus.ACTIVE;

    @Column({
        nullable: false,
        type: 'boolean',
        default: false,
        name: 'is_verified',
    })
    isVerified!: boolean;

    @Column({
        nullable: true,
        type: 'jsonb',
        name: 'avatar',
    })
    avatar: {
        url: string;
        publicId: string;
    } | null = null;


    @CreateDateColumn({
        name: 'created_at',
    })
    createdAt!: Date;

        @UpdateDateColumn({
        name: 'updated_at',
    })
    updatedAt!: Date;

    @DeleteDateColumn({
        name: 'deleted_at',
    })
    deletedAt?: Date;
}