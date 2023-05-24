import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Auth, GetHeader,GetUser } from './decorators';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/auth.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
   loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRouter(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail:string,
    @GetHeader() header: any
  ){
  console.log(request);
  
    
    return {
      ok: true,
      message: 'HOla mundo privat e',
      user,
      userEmail,
      header
    }
  }

  @Get('private2')
  //@SetMetadata('roles',['admin','super-user'])
  //metadata sirve para añadir informacion extra al metodo o  controlador que quiero ejecutar
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User
  ){
    return {
      ok: true,
      user
    }
  }

  @Get('private3')
  //@SetMetadata('roles',['admin','super-user'])
  //metadata sirve para añadir informacion extra al metodo o  controlador que quiero ejecutar
  @Auth(ValidRoles.admin)
  privateRoute3(
    @GetUser() user: User
  ){
    return {
      ok: true,
      user
    }
  }

}
