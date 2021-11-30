import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  MainGraphQLModel,
  NewMainInput,
} from '../../../common/dto/main.model.GraphQL';
import { GraphQLListModel } from '../../../common/dto/listArgs';

@InputType()
export class NewCountryInput extends NewMainInput {}

@ObjectType({ description: 'country' })
export class CountryGraphQLModel extends MainGraphQLModel {}

@ObjectType({ description: 'Countries list' })
export class CountriesGraphQLListModel extends GraphQLListModel {
  @Field(() => [CountryGraphQLModel])
  list: CountryGraphQLModel[];
}

export class ICountryAsChild {
  @Field({ nullable: true })
  countryId?: string;

  @Field({ nullable: true })
  country?: string;
}
