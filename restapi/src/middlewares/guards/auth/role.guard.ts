import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import RequestWithUser from 'src/dtos/user/request-with-user';
import { ROLE_KEY } from 'src/services/auth/role.annotaion';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<boolean>('admin', [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('Welcome to RoleGuard');

    if (!requiredRoles) {
      return false;
    }

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    // console.log('User from request');
    // console.log(user);

    if (!user) {
      return false;
    }

    return user.isAdmin === requiredRoles;
  }
}
