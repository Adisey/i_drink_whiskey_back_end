import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Args } from '@nestjs/graphql';
import { compare } from 'bcryptjs';
import { expAccessToken, nbfToken } from '../../configs/jwt.config';
import { AuthTokenGraphQLModel, Login } from './models/auth.model.GraphQL';
import { UsersService } from 'src/domains/users/users.service';
import { JwtPayload } from '../auth/models/auth.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
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
