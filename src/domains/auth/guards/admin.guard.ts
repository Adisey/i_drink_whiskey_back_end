import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthenticationError } from 'apollo-server-core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { isRoleAdmin } from '../../../configs/auth.config';
import { IContentRequest } from 'src/domains/auth/models/auth.model';
import { getMessage } from 'src/apolloError';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext<IContentRequest>();
    if (req.user.role && isRoleAdmin(req.user.role)) {
      return true;
    }
    const message = getMessage('RIGHTS_NOT_ENOUGH');
    Logger.error(message, 'AdminGuard ');
    throw new AuthenticationError(message);
  }
}
