import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Args } from '@nestjs/graphql';
import { compare } from 'bcryptjs';
import { expAccessToken, nbfToken } from '../../configs/jwt.config';
import { ADMIN_ROLE_ID, passwordHash } from '../../configs/auth.config';
import { UsersService } from '../users/users.service';
import { AuthTokenGraphQLModel, Login } from './models/auth.model.GraphQL';
import { JwtPayload } from './models/auth.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    async function checkDefaultAdmin() {
      const admin = await userService.findUserByRole(ADMIN_ROLE_ID);
      const user = 'admin',
        passport = 'admin';
      if (!admin) {
        await userService.create({
          email: user,
          passwordHash: await passwordHash(passport),
          roleId: ADMIN_ROLE_ID,
        });
        Logger.warn(
          `Add default admin - "${user}:${passport}"`,
          'Initialization DB',
        );
      }
    }
    setTimeout(() => {
      checkDefaultAdmin();
    });
  }

  async getAccessToken(email: string) {
    const payload: JwtPayload = {
      email,
      nbf: nbfToken(),
      exp: expAccessToken(),
    };
    return await this.jwtService.signAsync(payload);
  }

  async login(@Args('data') dto: Login): Promise<AuthTokenGraphQLModel> {
    const foundUser = await this.userService.findUserByEmail(dto.email);

    if (!foundUser || !(await compare(dto.password, foundUser.passwordHash))) {
      return { access_token: null };
    }

    return { access_token: await this.getAccessToken(foundUser.email) };
  }
}
