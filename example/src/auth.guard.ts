import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>() as any
    const fakeUser = {
      roles: ['ADMIN_UPDATE_OWN_VIDEO', 'USER_CREATE_ANY_VIDEO'],
      username: '@fake',
    };
    (req as any).user = fakeUser;
    return true;
  }
}
