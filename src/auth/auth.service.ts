import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { JwtService } from '@nestjs/jwt';
import { expAccessToken, nbfToken } from 'src/configs/jwt.config';
import { UserDBModel } from 'src/user/models/user.model.DB';
import { Args } from '@nestjs/graphql';
import {
  AuthTokenGraphQLModel,
  LoginUser,
} from 'src/auth/models/auth.model.GraphQL';
import { compare } from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from 'src/auth/models/auth.model';

@Injectable()
export class AuthService {
  // ToDo: 25.10.2021 - think about AuthDBModel
  constructor(
    @InjectModel(UserDBModel)
    private readonly authModel: ModelType<UserDBModel>,
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

  async login(@Args('data') user: LoginUser): Promise<AuthTokenGraphQLModel> {
    const foundUser = await this.userService.findUserByEmail(user.email);

    if (!foundUser || !(await compare(user.password, foundUser.passwordHash))) {
      return { access_token: null };
    }

    return { access_token: await this.getAccessToken(foundUser.email) };
  }
}
