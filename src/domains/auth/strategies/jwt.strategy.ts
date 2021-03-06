import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticationError } from 'apollo-server-core';

import { getMessage } from '../../../apolloError';
import { ConfigService } from '../../../configs/app.config.service';
import { UsersService } from 'src/domains/users/users.service';
import { IAuthContentUser, JwtPayload } from '../models/auth.model';
import { isTrue } from 'src/common/services';

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
      isDebugMode: isTrue(configService.getENV('IS_DEBUG_MODE')),
    });
  }

  async validate(payload: JwtPayload): Promise<IAuthContentUser | void> {
    const foundUser = await this.userService.findUserByEmail(payload.email);
    if (!foundUser) {
      const message = getMessage('USER_BAD');
      this.isDebugMode && Logger.error(message, payload.email, 'JwtStrategy');
      throw new AuthenticationError(message);
    }

    return foundUser;
  }
}
