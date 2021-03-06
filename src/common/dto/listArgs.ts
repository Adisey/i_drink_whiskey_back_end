import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import { Max, Min, IsIn } from 'class-validator';
import { MainGraphQLModel } from './main.model.GraphQL';

@ArgsType()
export class ListArgs {
  @Field(() => Int)
  @Min(1)
  pageNumber = 1;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  pageSize = 5;

  @Field(() => String)
  find = '';

  @Field(() => String)
  sortBy = 'name';

  @Field(() => Int)
  @IsIn([-1, 1])
  sortOrder = 1;
}

@ObjectType({ description: 'List' })
export class GraphQLListModel {
  @Field(() => [MainGraphQLModel])
  list: any[];

  @Field()
  totalCount: number;
}
