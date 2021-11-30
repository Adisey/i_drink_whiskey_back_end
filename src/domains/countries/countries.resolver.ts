import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { getMessage } from '../../apolloError';
import { ListArgs } from '../../common/dto/listArgs';
import { AdminGuard } from '../auth/guards';
import { CountriesService } from './countries.service';
import {
  NewCountryInput,
  CountryGraphQLModel,
  CountriesGraphQLListModel,
} from './models/countries.model.GraphQL';

const pubSub = new PubSub();

@Resolver(() => CountryGraphQLModel)
export class CountriesResolver {
  constructor(private readonly countriesService: CountriesService) {}

  @Query(() => CountriesGraphQLListModel)
  async countriesList(
    @Args() listArgs: ListArgs,
  ): Promise<CountriesGraphQLListModel> {
    return await this.countriesService.list(listArgs);
  }

  @Mutation(() => CountryGraphQLModel, {
    description: getMessage('USER_ADMIN_ONLY'),
  })
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe())
  async addCountry(
    @Args('data') data: NewCountryInput,
  ): Promise<CountryGraphQLModel> {
    const country = (await this.countriesService.add(
      data,
    )) as unknown as CountryGraphQLModel;
    pubSub.publish('countryAdded', { countryAdded: country });
    return country;
  }

  @Subscription(() => CountryGraphQLModel)
  countryAdded() {
    return pubSub.asyncIterator('countryAdded');
  }
}
