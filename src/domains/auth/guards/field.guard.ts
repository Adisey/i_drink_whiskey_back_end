import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IContentRequest } from 'src/domains/auth/models/auth.model';
import { Observable } from 'rxjs';

// ToDo: 24.11.2021 - Need make check user fields access for query

@Injectable()
export class FieldGuard implements CanActivate {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    console.log(+new Date(), '-(FieldGuard)-getRequest->', `-ctx->`, ctx);
    return ctx.getContext<IContentRequest>().req;
  }

  // Returns an array of all the properties of an object seperated by a .
  getPropertiesArray(object: any): string[] {
    let result: string[] = [];
    Object.entries(object).forEach(([key, value]) => {
      const field = key;
      if (typeof value === 'object' && value !== null) {
        const objectProperties = this.getPropertiesArray(value).map(
          (prop) => `${field}.${prop}`,
        );
        result = result.concat(objectProperties);
      } else {
        result.push(field);
      }
    });
    return result;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(+new Date(), '-(FieldGuard)-canActivate->', 'context', context);
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    console.log(+new Date(), '-()->', typeof request, `-request->`, request);
    const args = ctx.getArgs();
    console.log(+new Date(), '-()->', typeof args, `-args->`, args);
    const aa = context.getHandler();
    console.log(+new Date(), '-()->', typeof aa, `-aa->`, aa);
    const argFields = this.getPropertiesArray(args);
    console.log(
      +new Date(),
      '-()->',
      typeof argFields,
      `-argFields->`,
      argFields,
    );
    return true;
  }

  handleRequest(err: any, user: any, info: any, context: any) {
    console.log(+new Date(), '-(FieldGuard)-handleRequest->', `-err->`, err);
    console.log(+new Date(), '-(FieldGuard)-handleRequest->', `-user->`, user);
    console.log(+new Date(), '-(FieldGuard)-handleRequest->', `-info->`, info);
    console.log(
      +new Date(),
      '-(FieldGuard)-handleRequest->',
      `-context->`,
      context,
    );
    return user;
  }
}
