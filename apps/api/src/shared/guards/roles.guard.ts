import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "src/users/constants";
import { ROLES_KEY } from "../constants";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private  reflector: Reflector){}

    canActivate(ctx: ExecutionContext) {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            ctx.getHandler(),
            ctx.getClass()
        ]);

        if(!requiredRoles || requiredRoles.length === 0) return true;
        const {user} = ctx.switchToHttp().getRequest()
        if(!user) return false;
        return requiredRoles.includes(user.role);
    }
}