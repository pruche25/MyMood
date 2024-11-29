import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async register(userDto: CreateUserDto) {
    const user = await this.userService.getUser(userDto.email);
    if (user) {
      throw new HttpException('해당 유저가 이미 있습니다.', HttpStatus.BAD_REQUEST);
    }

    // 비밀번호 암호화
    const encryptedPassword = bcrypt.hashSync(userDto.password, 10);

    try {
      const user = await this.userService.createUser({
        ...userDto,
        password: encryptedPassword,
      });
      // 회원 가입 후 반환하는 값에는 password를 주지 않음
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException('서버 에러', 500);
    }
  }

  async login(email: string, password: string) {
    const userInfo = await this.validateUser(email, password);
    if (!userInfo) {
      throw new HttpException('해당 유저가 없습니다.', HttpStatus.BAD_REQUEST);
    }
    const payload = { id: userInfo.id, name: userInfo.username, email: userInfo.email };

    // 토큰 발급
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.getUser(email);

    if (!user) {
      return null;
    }
    const { password: hashedPassword, ...userInfo } = user;
    if (bcrypt.compareSync(password, hashedPassword)) {
      // 패스워드가 일치하면 성공
      return userInfo;
    }
    return null;
  }

  // 토큰 검증
  verify(jwtString: string) {
    try {
      const payload = jwt.verify(jwtString, process.env.JWT_SECRET_KEY) as (jwt.JwtPayload | string) & User;
      const { id, email } = payload;
      return {
        userId: id,
        email,
      };
    } catch (e) {
      throw new HttpException('서버 에러', 500);
    }
  }
}
