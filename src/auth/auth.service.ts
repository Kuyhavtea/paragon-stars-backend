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
    const user = await this.usersService.findByEmail(details.email);
    
    if (user) {
      return this.updateUserDetails(user, details);
    }
    
    return this.usersService.create({
      email: details.email,
      firstName: details.firstName,
      lastName: details.lastName,
      picture: details.picture,
      isGoogleAccount: true,
    });
  }

  private async updateUserDetails(user: any, details: any) {
    // Update user details if needed
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