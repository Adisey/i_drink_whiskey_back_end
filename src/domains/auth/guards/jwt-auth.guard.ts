import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { AuthenticationError } from 'apollo-server-core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { IContentRequest } from 'src/domains/auth/models/auth.model';
import { getMessage } from 'src/apolloError';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { config } from 'src/domains/auth/config';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<IContentRequest>().req;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      config.PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      Logger.error(info, 'JwtAuthGuard');
      throw err || new AuthenticationError(getMessage('TOKEN_INVALID'));
    }
    return user;
  }
}
