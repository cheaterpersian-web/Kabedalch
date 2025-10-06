import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { RateLimit, RateLimitGuard } from '../common/rate-limit.guard';
import { Public } from '../common/jwt-auth.guard';

class RegisterDto {
  name!: string;
  family!: string;
  phone!: string;
  email!: string;
  password!: string;
}

class LoginDto {
  email!: string;
  password!: string;
}

class RefreshDto {
  refreshToken!: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  @Public()
  @UseGuards(RateLimitGuard)
  @RateLimit(5, 60)
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @Public()
  @UseGuards(RateLimitGuard)
  @RateLimit(10, 60)
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post('refresh')
  @Public()
  @UseGuards(RateLimitGuard)
  @RateLimit(20, 60)
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refreshWithToken(dto.refreshToken);
  }
}
