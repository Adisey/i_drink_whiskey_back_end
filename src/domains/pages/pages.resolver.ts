import { Query, Resolver } from '@nestjs/graphql';
import { Public } from 'src/domains/auth/decorators/public.decorator';
import { PagesService } from 'src/domains/pages/pages.service';
import {
  PageGraphQLModel,
  PageListGraphQLModel,
  PagesTreeGraphQLModel,
} from './models/pages.model.GraphQL';

@Resolver(() => PageListGraphQLModel)
export class PagesResolver {
  constructor(private readonly pagesService: PagesService) {}

  @Query(() => [PageGraphQLModel])
  @Public()
  async pagesList(): Promise<PageGraphQLModel[]> {
    return await this.pagesService.pagesList();
  }

  @Query(() => PagesTreeGraphQLModel)
  @Public()
  async pagesListTree(): Promise<PagesTreeGraphQLModel> {
    return this.pagesService.pagesListTree();
  }
}
