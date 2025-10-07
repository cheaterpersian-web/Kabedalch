import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { RateLimit, RateLimitGuard } from '../common/rate-limit.guard';
import { Public } from '../common/jwt-auth.guard';

class RegisterDto {
  @IsString() name!: string;
  @IsString() family!: string;
  @IsString() phone!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(6) password!: string;
}

class LoginDto {
  @IsEmail() email!: string;
  @IsString() password!: string;
}

class RefreshDto {
  @IsString() refreshToken!: string;
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
