import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import RequestWithUser from 'src/dtos/user/request-with-user';
import { ROLE_KEY } from 'src/services/auth/role.annotaion';
import { Role } from 'src/services/auth/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('Welcome to RoleGuard');

    if (!requiredRoles) {
      return false;
    }

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    // console.log('User from request');
    console.log(user);

    if (!user) {
      return false;
    }

    console.log(`Request contain User`);

    let userRole: 1|0;
    if (user.isAdmin === true) {
      userRole = 1;
    }
    else {
      userRole = 0;
    }

    return requiredRoles.some(role => {
      const temp = role === Role.Admin ? 1 : 0;
      return userRole === temp;
    });
  }
}
