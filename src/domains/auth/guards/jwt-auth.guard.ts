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
  constructor(
    private readonly reflector: Reflector,
    private readonly isDebugMode: boolean,
  ) {
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

    const ctx = GqlExecutionContext.create(context);

    if (!ctx.getContext()?.req) {
      // ToDo: 08.02.2022 - need think about better check WS token
      Logger.log('Connect', 'WS');
      return true;
    }

    if (this.isDebugMode) {
      const { body, headers } = ctx.getContext()?.req;
      Logger.log(headers, body, 'API Request');
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: any) {
    if (err || !user) {
      Logger.error(
        info,
        JSON.stringify({
          err,
          user,
        }),
        'JwtAuthGuard',
      );
      console.error('context ->', context);
      throw err || new AuthenticationError(getMessage('TOKEN_INVALID'));
    }
    return user;
  }
}
