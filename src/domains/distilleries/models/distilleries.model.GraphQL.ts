import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { GraphQLListModel } from '../../../common/dto/listArgs';
import {
  IRegionAsChild,
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

export class IDistilleryAsChild extends IRegionAsChild {
  @Field({ nullable: true })
  distilleryId?: string;

  @Field({ nullable: true })
  distillery?: string;
}
