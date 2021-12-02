import { Field, ObjectType } from '@nestjs/graphql';
import { MainGraphQLModel } from 'src/common/dto/main.model.GraphQL';

@ObjectType({ description: 'Pages tree list' })
export class PagesTreeGraphQLModel {
  @Field(() => [PageTreeCountryGraphQLModel])
  countries: PageTreeCountryGraphQLModel[];
}

@ObjectType()
export class PageTreeCountryGraphQLModel extends MainGraphQLModel {
  @Field(() => [PageTreeRegionGraphQLModel])
  regions: PageTreeRegionGraphQLModel[];
}

@ObjectType()
export class PageTreeRegionGraphQLModel extends MainGraphQLModel {
  @Field(() => [PageTreeDistilleryGraphQLModel])
  distilleries: PageTreeDistilleryGraphQLModel[];
}

@ObjectType()
export class PageTreeDistilleryGraphQLModel extends MainGraphQLModel {
  @Field(() => [PageWhiskyGraphQLModel])
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
