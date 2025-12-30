import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    // Se la rotta NON ha ruoli → accesso libero
    if (!roles) return true;

    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // user arriva dal JwtAuthGuard
    return roles.includes(user.role);
  }
}
