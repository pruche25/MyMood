import { Body, Controller, Post, Request } from '@nestjs/common';
import { CreateUserDto } from 'src/user/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // 회원 가입
  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    return await this.authService.register(userDto);
  }

  // 로그인
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.body.email, req.body.password);
  }
}
