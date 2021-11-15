import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { ListArgsOLD } from 'src/global/dto/listArgs';
import { CountryService } from './country.service';
import {
  NewCountryInput,
  CountryGraphQLModel,
} from './models/country.model.GraphQL';
import { CreateCountryDto } from './models/country.model.DB';

const pubSub = new PubSub();

@Resolver((of) => CountryGraphQLModel)
export class CountryResolver {
  constructor(private readonly countryService: CountryService) {}

  @Query((returns) => [CountryGraphQLModel])
  async countryList(
    @Args() listArgs: ListArgsOLD,
  ): Promise<CountryGraphQLModel[]> {
    const aa = await this.countryService.findAll(listArgs);
    console.log(+new Date(), '-()->', typeof aa, `-aa->`, aa);
    return aa as unknown as CountryGraphQLModel[];
  }

  @Mutation((returns) => CountryGraphQLModel)
  @UsePipes(new ValidationPipe())
  async addCountry(
    @Args('data') newCountryData: NewCountryInput,
  ): Promise<CountryGraphQLModel> {
    const country = (await this.countryService.create(
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
