//Core
import { Field, InputType, ObjectType } from '@nestjs/graphql';
// Main
import { GraphQLListModel } from '../../../common/dto/listArgs';
import {
  IRegionAsChild,
  NewRegionInput,
  RegionGraphQLModel,
} from '../../regions/models/regions.model.GraphQL';
//Domains
import { MainGraphQLModel } from 'src/common/dto/main.model.GraphQL';

@InputType()
export class NewDistilleryInput extends NewRegionInput {
  @Field({ nullable: true })
  regionId?: string;

  @Field({ nullable: true })
  region?: string;
}

@ObjectType({ description: 'Distillery' })
export class DistilleryGraphQLModel extends RegionGraphQLModel {
  @Field({ nullable: true })
  regionId?: string;

  @Field({ nullable: true })
  region?: string;
}

@ObjectType({ description: 'Distillery & Children' })
export class DistilleryChildrenGraphQLModel extends DistilleryGraphQLModel {
  @Field(() => [MainGraphQLModel])
  children: MainGraphQLModel[];
}

@ObjectType({ description: 'Distilleries list' })
export class DistilleriesGraphQLListModel extends GraphQLListModel {
  @Field(() => [DistilleryGraphQLModel])
  list: DistilleryGraphQLModel[];
}

export class IDistilleryAsChild extends IRegionAsChild {
  name?: never;
  description?: never;
  distilleryId?: string;
  distillery?: string;
}
