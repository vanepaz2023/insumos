import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/auth.entity';
import { META_ROLES } from 'src/auth/decorators/role-protected/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
private readonly reflector: Reflector
  ){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
 const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler())
 const req = context.switchToHttp().getRequest();
 const user = req.user as User;
 console.log("USUARIO",user);
 
    if (!user)
    throw new BadRequestException('user not found')
    console.log({userRoles: user.roles});

    for(const role of user.roles){
      if(validRoles.includes(role)){
        return true;
      }
    }
    
    throw new ForbiddenException(
      `User ${ user.fullName} need a valid role: [${ validRoles }]`
    )
    return true;
  }
}
