import { UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { ListArgsOLD } from 'src/common/dto/listArgs';
import { CountriesService } from 'src/domains/countries/countries.service';
import {
  NewCountryInput,
  CountryGraphQLModel,
} from 'src/domains/countries/models/countries.model.GraphQL';
import { CreateCountryDto } from 'src/domains/countries/models/countries.model.DB';

const pubSub = new PubSub();

@Resolver((of) => CountryGraphQLModel)
export class CountriesResolver {
  constructor(private readonly countriesService: CountriesService) {}

  @Query((returns) => [CountryGraphQLModel])
  async countriesList(
    @Args() listArgs: ListArgsOLD,
  ): Promise<CountryGraphQLModel[]> {
    const aa = await this.countriesService.findAll(listArgs);
    console.log(+new Date(), '-()->', typeof aa, `-aa->`, aa);
    return aa as unknown as CountryGraphQLModel[];
  }

  @Mutation((returns) => CountryGraphQLModel)
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
