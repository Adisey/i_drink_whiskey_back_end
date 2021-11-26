import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { GraphQLListModel } from '../../../common/dto/listArgs';
import {
  NewRegionInput,
  RegionGraphQLModel,
} from '../../regions/models/regions.model.GraphQL';

@InputType()
export class NewDistilleryInput extends NewRegionInput {
  @Field({ nullable: true })
  regionId?: string;

  @Field({ nullable: true })
  region?: string;
}

@ObjectType({ description: 'distillery' })
export class DistilleryGraphQLModel extends RegionGraphQLModel {
  @Field({ nullable: true })
  regionId?: string;

  @Field({ nullable: true })
  region?: string;
}

@ObjectType({ description: 'Distilleries list' })
export class DistilleriesGraphQLListModel extends GraphQLListModel {
  @Field(() => [DistilleryGraphQLModel])
  list: DistilleryGraphQLModel[];
}
