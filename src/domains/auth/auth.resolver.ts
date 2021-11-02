//Core
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import {
  Login,
  AuthGraphQLModel,
  AuthTokenGraphQLModel,
} from 'src/domains/auth/models/auth.model.GraphQL';

@Resolver(() => AuthGraphQLModel)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Mutation(() => AuthTokenGraphQLModel)
  async login(@Args('data') dto: Login): Promise<AuthTokenGraphQLModel> {
    return this.authService.login(dto);
  }
}
