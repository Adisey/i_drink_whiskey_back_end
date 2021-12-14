//Core
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  MainGraphQLModel,
  NewMainInput,
} from '../../../common/dto/main.model.GraphQL';
//Main
import { GraphQLListModel } from '../../../common/dto/listArgs';

@InputType()
export class NewCountryInput extends NewMainInput {}

@ObjectType({ description: 'country' })
export class CountryGraphQLModel extends MainGraphQLModel {}

@ObjectType({ description: 'Countries & Children' })
export class CountryChildrenGraphQLModel extends CountryGraphQLModel {
  @Field(() => [MainGraphQLModel])
  children: MainGraphQLModel[];
}

@ObjectType({ description: 'Countries list' })
export class CountriesGraphQLListModel extends GraphQLListModel {
  @Field(() => [CountryGraphQLModel])
  list: CountryGraphQLModel[];
}

export class ICountryAsChild {
  name?: never;
  description?: never;
  countryId?: string;
  country?: string;
}
