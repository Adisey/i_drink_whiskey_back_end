import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticationError } from 'apollo-server-core';

import { ConfigService } from '../../../configs/app.config.service';
import { UserService } from '../../user/user.service';
import { IAuthValidUser, JwtPayload } from '../models/auth.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getENV('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<IAuthValidUser | void> {
    const foundUser = await this.userService.findUserByEmail(payload.email);
    if (!foundUser) {
      throw new AuthenticationError(
        'Could not log-in with the provided credentials',
        // ToDo: 12.11.2021 - use getMessage
        // ToDo: 12.11.2021 - add Logger
      );
    }

    return {
      email: foundUser.email,
      role: foundUser.role,
    };
  }
}
