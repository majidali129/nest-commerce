import { UserRole } from "src/users/constants";

declare global {
    namespace Express {
      interface Request {
        user: {
          id: number;
          name: string;
          email: string;
          role: UserRole;
          avatar: string | null;
        };
      }
    }
  }
  
  export {};
  