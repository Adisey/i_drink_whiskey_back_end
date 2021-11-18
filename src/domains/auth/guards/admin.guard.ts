import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AuthenticationError } from 'apollo-server-core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { isRoleAdmin } from '../../../configs/auth.config';
import { getMessage } from '../../../apolloError';
import { IContentRequest } from '../models/auth.model';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext<IContentRequest>();
    const { user } = req;
    // ToDo: 18.11.2021 - need use usersService.isUserAdmin and remove reoleId for token
    if (user.roleId && isRoleAdmin(user.roleId)) {
      return true;
    }
    const message = getMessage('RIGHTS_NOT_ENOUGH');
    Logger.error(message, JSON.stringify(user), 'AdminGuard');
    throw new AuthenticationError(message);
  }
}
