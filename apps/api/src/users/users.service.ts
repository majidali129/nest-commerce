import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import {
  AccessTokenPayload,
  AccountStatus,
  RefreshTokenPayload,
  USER_REPOSITORY,
} from './constants'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { CreateUserDto } from './dtos/create-user-dto'
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dtos/login-user-dto'

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepo: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto
    const hashedPassword = await bcrypt.hash(
      password,
      +this.configService.get('BCRYPT_SALT_ROUNDS') || 12,
    )

    const existingUser = await this.userRepo.exists({ where: { email } })
    if (existingUser)
      throw new ConflictException('User with this email already exists')

    const user = this.userRepo.create({
      name,
      email,
      password: hashedPassword,
    })
    const createdUser = await this.userRepo.save(user)

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
      accountStatus: createdUser.accountStatus,
      isVerified: createdUser.isVerified,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto
    const user = await this.userRepo.findOne({ where: { email } })

    if (!user) throw new UnauthorizedException('Invalid email or password')

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid email or password')

    const accessToken = await this.getAccessToken({
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      avatar: user.avatar?.url || '',
    })
    const refreshToken = await this.getRefreshToken({
      userId: user.id,
      role: user.role,
    })

    const hashedRefreshToken = await bcrypt.hash(
      refreshToken,
      +this.configService.get('BCRYPT_SALT_ROUNDS') || 12,
    )

    await this.userRepo.update(user.id, {
      refreshToken: hashedRefreshToken,
      updatedAt: new Date(),
    })

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    }
  }

  async getUserById(userId: number) {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
        accountStatus: AccountStatus.ACTIVE,
        isVerified: true,
      },
    })
    if (!user) return null

    return user
  }

  async getUserProfile(userId: number) {
    const user = await this.getUserById(userId)
    if (!user) throw new UnauthorizedException()

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      accountStatus: user.accountStatus,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  async logoutUser(userId: number) {
    const user = await this.getUserById(userId)
    if (!user) throw new UnauthorizedException()

    return await this.userRepo.update(userId, {
      refreshToken: null,
      updatedAt: new Date(),
    })
  }


  async refreshToken(_refreshToken: string) {}
  private async getAccessToken(payload: AccessTokenPayload) {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRY') as '1d',
    })
  }

  private async getRefreshToken(payload: RefreshTokenPayload) {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRY') as '7d',
    })
  }

  private verifyToken(_token: string) {}
}
