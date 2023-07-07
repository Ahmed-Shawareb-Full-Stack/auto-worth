import { IsString, IsEmail, IsBoolean } from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
