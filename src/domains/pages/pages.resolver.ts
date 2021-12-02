import { Query, Resolver } from '@nestjs/graphql';
import { Public } from 'src/domains/auth/decorators/public.decorator';
import { PagesService } from 'src/domains/pages/pages.service';
import {
  PageGraphQLModel,
  PageListGraphQLModel,
} from './models/pages.model.GraphQL';

@Resolver(() => PageListGraphQLModel)
export class PagesResolver {
  constructor(private readonly pagesService: PagesService) {}

  @Query(() => [PageGraphQLModel])
  @Public()
  async pagesList(): Promise<PageGraphQLModel[]> {
    return await this.pagesService.pagesList();
  }
}
