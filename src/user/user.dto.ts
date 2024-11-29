import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @MaxLength(60)
  email: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(30)
  username: string;
}

export class updateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  username: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  password: string;
}
