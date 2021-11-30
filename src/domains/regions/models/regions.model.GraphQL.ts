import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  MainGraphQLModel,
  NewMainInput,
} from '../../../common/dto/main.model.GraphQL';
import { GraphQLListModel } from '../../../common/dto/listArgs';
import { ICountryAsChild } from '../../countries/models/countries.model.GraphQL';

@InputType()
export class NewRegionInput extends NewMainInput {
  @Field({ nullable: true })
  countryId?: string;

  @Field({ nullable: true })
  country?: string;
}

@ObjectType({ description: 'region' })
export class RegionGraphQLModel extends MainGraphQLModel {
  @Field({ nullable: true })
  countryId?: string;

  @Field({ nullable: true })
  country?: string;
}

@ObjectType({ description: 'Regions list' })
export class RegionsGraphQLListModel extends GraphQLListModel {
  @Field(() => [RegionGraphQLModel])
  list: RegionGraphQLModel[];
}

export class IRegionAsChild extends ICountryAsChild {
  @Field({ nullable: true })
  regionId?: string;

  @Field({ nullable: true })
  region?: string;
}
