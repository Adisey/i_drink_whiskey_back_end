//Core
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { Public } from './decorators/public.decorator';
import { AuthService } from './auth.service';
import {
  Login,
  AuthGraphQLModel,
  AuthTokenGraphQLModel,
} from 'src/domains/auth/models/auth.model.GraphQL';

@Resolver(() => AuthGraphQLModel)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthTokenGraphQLModel)
  @UsePipes(new ValidationPipe())
  @Public()
  async login(@Args('data') dto: Login): Promise<AuthTokenGraphQLModel> {
    return this.authService.login(dto);
  }
}
