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
import {
  NewRegionInput,
  RegionChildrenGraphQLModel,
  RegionGraphQLModel,
  RegionsGraphQLListModel,
} from './models/regions.model.GraphQL';
import { DistilleriesService } from '../distilleries/distilleries.service';
import { Public } from '../auth/decorators/public.decorator';
//Local
import { RegionsService } from './regions.service';

const pubSub = new PubSub();

@Resolver(() => RegionGraphQLModel)
export class RegionsResolver {
  constructor(
    private readonly regionsService: RegionsService,
    private readonly distilleriesService: DistilleriesService,
  ) {}

  @Query(() => RegionChildrenGraphQLModel)
  @Public()
  async getRegion(@Args('id') id: string): Promise<RegionChildrenGraphQLModel> {
    const recipe = await this.regionsService.getItem(id);
    if (!recipe) {
      throw new NotFoundException(id);
    }
    const distilleries = await this.distilleriesService.listByRegion(id);

    return {
      ...recipe,
      children: distilleries,
    };
  }

  @Query(() => RegionsGraphQLListModel)
  @Public()
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
