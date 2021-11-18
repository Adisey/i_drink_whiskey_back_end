import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import {
  IAuthKokenUser,
  IContentRequest,
  IContentRequestUserFields,
} from 'src/domains/auth/models/auth.model';

export const User = createParamDecorator(
  (
    key: IContentRequestUserFields,
    context: ExecutionContext,
  ): IAuthKokenUser | string => {
    const { user } =
      GqlExecutionContext.create(context).getContext<IContentRequest>().req;

    if (!user) {
      return null;
    } else if (!key) {
      return user;
    } else {
      return user[key];
    }
  },
);
