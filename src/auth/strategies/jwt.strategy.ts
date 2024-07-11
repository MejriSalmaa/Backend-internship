/* eslint-disable prettier/prettier */

import { Injectable , UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
      private readonly userService: UserService,
    ) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: process.env.JWT_SECRET, // Hardcoded secret key
      });
    }

  async validate(payload: any) {
    const user = await this.userService.findUserById(payload._id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return { _id: user._id, email: user.email }; // Include _id in the returned user object
  }
}
