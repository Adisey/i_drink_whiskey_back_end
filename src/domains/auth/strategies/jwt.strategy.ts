import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticationError } from 'apollo-server-core';

import { getMessage } from '../../../apolloError';
import { ConfigService } from '../../../configs/app.config.service';
import { UsersService } from 'src/domains/users/users.service';
import { IAuthValidUser, JwtPayload } from '../models/auth.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly userService: UsersService,
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
      const message = getMessage('USER_NOT_FOUND');
      Logger.error(message, payload.email, 'JwtStrategy');
      throw new AuthenticationError(message);
    }

    return foundUser;
  }
}

Logger.error('1');
Logger.error('11', '22');
Logger.error('111', '222', '333');
Logger.error('1111', '2222', '3333', '4444');

Logger.log('1');
Logger.log('11', '22');
Logger.log('111', '222', '333');
Logger.log('1111', '2222', '3333', '4444');
