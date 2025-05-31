import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID')!,
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET')!,
      callbackURL: configService.get('GOOGLE_CALLBACK_URL')!,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }
  
  async validate(req: any, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { id, name, emails, photos } = profile;
    const email = emails[0].value;

    const allowedDomain = this.configService.get('ALLOWED_EMAIL_DOMAIN')!;
    if (!email.endsWith(allowedDomain)) {
      return done(new Error(`Please use your email from the allowed domain: ${allowedDomain}`), false);
    }

    try {
      const user = await this.authService.validateGoogleUser({
        id: id,
        email: email,
        firstName: name.givenName,
        lastName: name.familyName,
        picture: photos[0]?.value,
      });
      
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}