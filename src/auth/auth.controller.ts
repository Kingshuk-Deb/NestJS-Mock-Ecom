import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createAuthDto: CreateAuthDto, @Res() res) {
    const { accessToken, refreshToken, ...user } =
      await this.authService.signUp(createAuthDto);
    res.header('access_token', accessToken);
    res.header('refresh_token', refreshToken);
    res.send(user);
  }

  @Post('signin')
  async signin(@Body() createAuthDto: CreateAuthDto, @Res() res) {
    const { accessToken, refreshToken, ...user } =
      await this.authService.signIn(createAuthDto);
    res.header('access_token', accessToken);
    res.header('refresh_token', refreshToken);
    res.send(user);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('access')
  accessTokens(@Req() req) {
    const userId = req.user['id'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.accessTokens(userId, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req) {
    this.authService.logout(req.user['id']);
  }
}
