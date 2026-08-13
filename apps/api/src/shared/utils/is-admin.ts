// shared/utils/is-admin.ts
import { UserRole } from 'src/users/constants';
import type { AuthUser } from '../types/auth-user';

export function isAdmin(user: Pick<{ role: UserRole }, 'role'> | null | undefined): boolean {
  return user?.role === UserRole.ADMIN;
}