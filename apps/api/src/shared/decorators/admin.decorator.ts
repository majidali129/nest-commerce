import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/roles.guard";
import { UserRole } from "src/users/constants";
import { Roles } from "./roles.decorator";

export const Admin = () => applyDecorators(
    UseGuards(AuthGuard, RolesGuard),
    Roles(UserRole.ADMIN)
)