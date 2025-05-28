import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateGoogleUser(details: any) {
    let user = await this.usersService.findByGoogleId(details.id);
    
    if (!user) {
      user = await this.usersService.findByEmail(details.email);
      
      if (user) {
        user = await this.usersService.update(user.id, {
          googleId: details.id,
          isGoogleAccount: true,
          firstName: details.firstName || user.firstName,
          lastName: details.lastName || user.lastName,
          picture: details.picture || user.picture,
        });
      } else {
        user = await this.usersService.create({
          email: details.email,
          firstName: details.firstName,
          lastName: details.lastName,
          picture: details.picture,
          googleId: details.id,
          isGoogleAccount: true,
        });
      }
    }
    
    return user;
  }

  generateJwt(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}