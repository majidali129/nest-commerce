export const USER_REPOSITORY = 'USER_REPOSITORY';
export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}
export enum AccountStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    BLOCKED = 'blocked',
}

export type AccessTokenPayload = {
    userId: number;
    role: UserRole;
    email: string;
    name: string;
    avatar: string | null;
};

export type RefreshTokenPayload = {
    userId: number;
    role: UserRole;
};