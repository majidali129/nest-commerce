import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;
}
