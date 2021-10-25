//Core
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { compare } from 'bcryptjs';

import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import {
  LoginUser,
  AuthGraphQLModel,
  AuthTokenGraphQLModel,
} from './models/auth.model.GraphQL';

@Resolver(() => AuthGraphQLModel)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Mutation(() => AuthTokenGraphQLModel)
  async login(@Args('data') user: LoginUser): Promise<AuthTokenGraphQLModel> {
    const foundUser = await this.userService.findUserByEmail(user.email);

    if (!foundUser || !(await compare(user.password, foundUser.passwordHash))) {
      return { access_token: null };
    }

    return { access_token: await this.authService.getToken(foundUser.email) };
  }
}
