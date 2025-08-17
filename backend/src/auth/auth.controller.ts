import { Body, Controller, Get, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Throttle } from '@nestjs/throttler';
import { AccessTokenGuard } from 'src/common/guards/access-token/access-token.guard';
import type { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Throttle({
    default: {
      limit: 5,
      ttl: 60000,
    },
  })
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Throttle({
    default: {
      limit: 5,
      ttl: 60000,
    },
  })
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {
    // Redirect handled by passport
  }

  @Get('github/config')
  getGithubConfig() {
    return {
      clientId: this.configService.get('GITHUB_CLIENT_ID'),
      callbackUrl: this.configService.get('GITHUB_CALLBACK_URL'),
      hasClientSecret: !!this.configService.get('GITHUB_CLIENT_SECRET'),
    };
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.user) {
        console.error('GitHub OAuth callback: No user data received');
        return res.redirect('http://127.0.0.1:3000/auth?error=oauth_failed');
      }

      const result = await this.authService.signInWithGithub(req.user);
      const frontendUrl = process.env.FRONTEND_URL ?? 'http://127.0.0.1:3000';
      
      if ('needsProfile' in result && result.needsProfile) {
        const redirectUrl = `${frontendUrl}/auth/complete-profile?token=${encodeURIComponent(
          result.access_token,
        )}`;
        return res.redirect(302, redirectUrl);
      }
      
      const redirectUrl = `${frontendUrl}/auth/callback?token=${encodeURIComponent(
        result.access_token,
      )}`;
      return res.redirect(302, redirectUrl);
    } catch (error) {
      console.error('GitHub OAuth callback error:', error);
      return res.redirect('http://127.0.0.1:3000/auth?error=oauth_failed');
    }
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(AccessTokenGuard)
  @Patch('profile')
  async updateProfile(@Req() req: Request, @Body() body: { name: string }) {
    const userId = req.user['sub'];
    const updatedUser = await this.authService.updateUserProfile(userId, body.name);
    return { message: 'Profile updated successfully', user: updatedUser };
  }
}
