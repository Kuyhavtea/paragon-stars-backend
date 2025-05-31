import { Controller, Get, Req, Res, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // this route will initiates the Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req, @Res() res: Response) {
    try {
      const token = this.authService.generateJwt(req.user);
      
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectUrl = `${frontendUrl}/auth/callback?token=${token.access_token}&user=${encodeURIComponent(JSON.stringify(token.user))}`;
      
      return res.redirect(redirectUrl);
    } catch (error) {
      // Redirect to frontend with error
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const errorUrl = `${frontendUrl}/auth?error=${encodeURIComponent(error.message)}`;
      return res.redirect(errorUrl);
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }

  @Post('test-login')
  async testLogin(@Body() body: { email: string; firstName?: string; lastName?: string }) {
    const mockUser = {
      email: body.email,
      firstName: body.firstName || 'Test',
      lastName: body.lastName || 'User',
      id: 1,
    };
    
    const token = this.authService.generateJwt(mockUser);
    return token;
  }
}