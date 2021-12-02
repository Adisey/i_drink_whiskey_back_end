import { ObjectType } from '@nestjs/graphql';
import { MainGraphQLModel } from 'src/common/dto/main.model.GraphQL';

@ObjectType({ description: 'Pages tree list' })
export class PagesTreeGraphQLModel {
  countries: PageTreeCountryGraphQLModel[];
}

@ObjectType()
export class PageTreeCountryGraphQLModel extends MainGraphQLModel {
  regions: PageTreeRegionGraphQLModel[];
}

@ObjectType()
export class PageTreeRegionGraphQLModel extends MainGraphQLModel {
  distilleries: PageTreeDistilleryGraphQLModel[];
}

@ObjectType()
export class PageTreeDistilleryGraphQLModel extends MainGraphQLModel {
  whiskies: PageWhiskyGraphQLModel[];
}

@ObjectType()
export class PageWhiskyGraphQLModel extends MainGraphQLModel {}

@ObjectType()
export class PageListGraphQLModel extends MainGraphQLModel {
  list: PageGraphQLModel[];
}

@ObjectType()
export class PageGraphQLModel extends MainGraphQLModel {}
