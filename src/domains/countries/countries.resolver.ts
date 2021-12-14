//Core

import {
  NotFoundException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
//Main
import { getMessage } from '../../apolloError';
import { ListArgs } from '../../common/dto/listArgs';
//Domains
import { AdminGuard } from '../auth/guards';
import { Public } from '../auth/decorators/public.decorator';
import { RegionChildrenGraphQLModel } from '../regions/models/regions.model.GraphQL';
import { RegionsService } from '../regions/regions.service';
//Local
import { CountriesService } from './countries.service';
import {
  NewCountryInput,
  CountryGraphQLModel,
  CountriesGraphQLListModel,
  CountryChildrenGraphQLModel,
} from './models/countries.model.GraphQL';

const pubSub = new PubSub();

@Resolver(() => CountryGraphQLModel)
export class CountriesResolver {
  constructor(
    private readonly countriesService: CountriesService,
    private readonly regionsService: RegionsService,
  ) {}

  @Query(() => CountryChildrenGraphQLModel)
  @Public()
  async getCountry(
    @Args('id') id: string,
  ): Promise<CountryChildrenGraphQLModel> {
    const recipe = await this.countriesService.getItem(id);
    if (!recipe) {
      throw new NotFoundException(id);
    }
    const regions = await this.regionsService.listByCountry(id);
    return {
      ...recipe,
      children: regions,
    };
  }

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
