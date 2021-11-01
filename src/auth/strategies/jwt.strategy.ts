import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticationError } from 'apollo-server-core';
import { UserService } from 'src/user/user.service';
import { IAuthValidUser, JwtPayload } from 'src/auth/models/auth.model';
import { ConfigService } from 'src/configs/app.config.service';

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
      );
    }

    return {
      email: foundUser.email,
      role: foundUser.role,
    };
  }
}
