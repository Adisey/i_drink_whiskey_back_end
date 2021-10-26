import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { expAccessToken, nbfToken } from 'src/configs/jwt.config';
import { Args } from '@nestjs/graphql';
import {
  AuthTokenGraphQLModel,
  Login,
} from 'src/auth/models/auth.model.GraphQL';
import { compare } from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from 'src/auth/models/auth.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

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
