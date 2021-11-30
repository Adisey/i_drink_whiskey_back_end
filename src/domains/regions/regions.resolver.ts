import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { getMessage } from '../../apolloError';
import { ListArgs } from '../../common/dto/listArgs';
import { AdminGuard } from '../auth/guards';
import { RegionsService } from './regions.service';
import {
  NewRegionInput,
  RegionGraphQLModel,
  RegionsGraphQLListModel,
} from './models/regions.model.GraphQL';

const pubSub = new PubSub();

@Resolver(() => RegionGraphQLModel)
export class RegionsResolver {
  constructor(private readonly regionsService: RegionsService) {}

  @Query(() => RegionsGraphQLListModel)
  async regionsList(
    @Args() listArgs: ListArgs,
  ): Promise<RegionsGraphQLListModel> {
    return await this.regionsService.list(listArgs);
  }

  @Mutation(() => RegionGraphQLModel, {
    description: getMessage('USER_ADMIN_ONLY'),
  })
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe())
  async addRegion(
    @Args('data') data: NewRegionInput,
  ): Promise<RegionGraphQLModel> {
    const region = await this.regionsService.add(data);
    pubSub.publish('regionAdded', { countryAdded: region });
    return region;
  }

  @Subscription(() => RegionGraphQLModel)
  regionAdded() {
    return pubSub.asyncIterator('regionAdded');
  }
}
