import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthenticationError } from 'apollo-server-core';
import { GqlExecutionContext } from '@nestjs/graphql';

import { isRoleAdmin } from '../../../configs/auth.config';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    if (req.user?.role && isRoleAdmin(req.user?.role)) {
      return true;
    }
    throw new AuthenticationError(
      'You are not enough rights for this operation.',
    );
  }
}
