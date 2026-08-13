import { Injectable } from '@nestjs/common';
import { AuthUser } from 'src/shared/types/auth-user';
import { CreateUserDto } from 'src/users/dtos/create-user-dto';
import { LoginUserDto } from 'src/users/dtos/login-user-dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    async signUp(signUpDto: CreateUserDto) {
        return this.usersService.createUser(signUpDto);
    }

    async signIn(signInDto: LoginUserDto) {
        return this.usersService.loginUser(signInDto);
    }

    
    async signOut(user: AuthUser) {
        return this.usersService.logoutUser(user.id);
    }

    async refreshToken(refreshToken: string) {
        return this.usersService.refreshToken(refreshToken);
    }
}
