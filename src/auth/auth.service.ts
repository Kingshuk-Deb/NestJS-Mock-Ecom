import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async signUp(createAuthDto: CreateAuthDto): Promise<{
    accessToken: string;
    refreshToken: string;
    _id: string;
    name: string;
    email: string;
  }> {
    // Check if user exists
    const userExists = await this.usersService.findOne({
      email: createAuthDto.email,
    });
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    // Hash password
    const hash = await this.hashData(createAuthDto.password);
    const user = await this.usersService.create({
      ...createAuthDto,
      password: hash,
    });
    const { accessToken, refreshToken } = await this.getTokens(user._id);
    await this.updateRefreshToken(user._id, refreshToken);
    return {
      accessToken,
      refreshToken,
      _id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async signIn(createAuthDto: CreateAuthDto): Promise<{
    accessToken: string;
    refreshToken: string;
    _id: string;
    name: string;
    email: string;
  }> {
    // Check if user exists
    const user = await this.usersService.findOne({
      email: createAuthDto.email,
    });
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(
      user.password,
      createAuthDto.password,
    );
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const { accessToken, refreshToken } = await this.getTokens(user._id);
    await this.updateRefreshToken(user._id, refreshToken);
    return {
      accessToken,
      refreshToken,
      _id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async logout(userId: string) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async accessTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    const refreshMatches = await argon2.verify(user.refreshToken, refreshToken);
    if (!refreshMatches)
      throw new ForbiddenException('Refresh Token is Incorrect');
    const { accessToken } = await this.getTokens(userId);
    return {
      accessToken,
    };
  }

  async getTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: userId,
        },
        {
          secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
        },
      ),
      this.jwtService.signAsync(
        {
          id: userId,
        },
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
