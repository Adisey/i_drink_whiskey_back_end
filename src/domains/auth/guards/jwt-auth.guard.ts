import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthenticationError } from 'apollo-server-core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { IContentRequest } from 'src/domains/auth/models/auth.model';
import { getMessage } from 'src/apolloError';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<IContentRequest>().req;
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      Logger.error(info, 'JwtAuthGuard ');
      throw err || new AuthenticationError(getMessage('TOKEN_INVALID'));
    }
    return user;
  }
}
