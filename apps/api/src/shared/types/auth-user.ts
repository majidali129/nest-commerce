import { UserRole } from "src/users/constants";

export interface AuthUser {
    id: number;
    name: string;
    email: string;
      role: UserRole;
    avatarUrl: string | null;
  }
  