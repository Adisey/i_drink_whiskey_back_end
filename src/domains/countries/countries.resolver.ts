import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { getMessage } from '../../apolloError';
import { ListArgs } from '../../common/dto/listArgs';
import { CountriesService } from './countries.service';
import {
  NewCountryInput,
  CountryGraphQLModel,
  CountriesGraphQLListModel,
} from './models/countries.model.GraphQL';
import { CreateCountryDto } from './models/countries.model.DB';

const pubSub = new PubSub();

@Resolver(() => CountryGraphQLModel)
export class CountriesResolver {
  constructor(private readonly countriesService: CountriesService) {}

  @Query(() => CountriesGraphQLListModel)
  async countriesList(
    @Args() listArgs: ListArgs,
  ): Promise<CountriesGraphQLListModel> {
    const aa = await this.countriesService.countriesList(listArgs);
    console.log(+new Date(), '-(RESOLVER)->', `-aa->`, aa);
    return aa;
  }

  @Mutation(() => CountryGraphQLModel, {
    description: getMessage('USER_ADMIN_ONLY'),
  })
  @UsePipes(new ValidationPipe())
  async addCountry(
    @Args('data') newCountryData: NewCountryInput,
  ): Promise<CountryGraphQLModel> {
    const country = (await this.countriesService.create(
      newCountryData as CreateCountryDto,
    )) as unknown as CountryGraphQLModel;
    pubSub.publish('countryAdded', { countryAdded: country });
    return country;
  }

  @Subscription(() => CountryGraphQLModel)
  countryAdded() {
    return pubSub.asyncIterator('countryAdded');
  }
}
