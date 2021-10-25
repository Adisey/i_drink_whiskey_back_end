//Core
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import {
  LoginUser,
  AuthGraphQLModel,
  AuthTokenGraphQLModel,
} from './models/auth.model.GraphQL';

@Resolver(() => AuthGraphQLModel)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Mutation(() => AuthTokenGraphQLModel)
  async login(@Args('data') user: LoginUser): Promise<AuthTokenGraphQLModel> {
    return this.authService.login(user);
  }
}
