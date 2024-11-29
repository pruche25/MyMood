import { Controller, Body, Get, Post, Param, Put, Delete, Headers, UseGuards } from '@nestjs/common';
//import { User } from './user.entity';
import { UserService } from './user.service';
import { CreateUserDto, updateUserDto } from './user.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('/create')
  async createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @Get('/getUser/:email')
  async getUser(@Param('email') email: string) {
    const user = await this.userService.getUser(email);
    return user;
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(@Headers() headers: any, @Param('id') userId: number) {
    const jwtString = headers.authorization.split('Bearer ')[1];
    this.authService.verify(jwtString);
    return this.userService.getUserInfo(userId);
  }

  @Put('/update/:email')
  async updateUser(@Param('email') email: string, @Body() user: updateUserDto) {
    return this.userService.updateUser(email, user);
  }

  @Delete('/delete/:email')
  async deleteUser(@Param('email') email: string) {
    return this.userService.deleteUser(email);
  }
}
