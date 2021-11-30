import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { getMessage } from '../../apolloError';
import { ListArgs } from '../../common/dto/listArgs';
import { AdminGuard } from '../auth/guards';
import { DistilleriesService } from './distilleries.service';
import {
  DistilleryGraphQLModel,
  DistilleriesGraphQLListModel,
  NewDistilleryInput,
} from './models/distilleries.model.GraphQL';

const pubSub = new PubSub();

@Resolver(() => DistilleryGraphQLModel)
export class DistilleriesResolver {
  constructor(private readonly distilleriesService: DistilleriesService) {}

  @Query(() => DistilleriesGraphQLListModel)
  async distilleriesList(
    @Args() listArgs: ListArgs,
  ): Promise<DistilleriesGraphQLListModel> {
    return await this.distilleriesService.list(listArgs);
  }

  @Mutation(() => DistilleryGraphQLModel, {
    description: getMessage('USER_ADMIN_ONLY'),
  })
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe())
  async addDistillery(
    @Args('data') data: NewDistilleryInput,
  ): Promise<DistilleryGraphQLModel> {
    const distillery = await this.distilleriesService.add(data);
    pubSub.publish('distilleryAdded', { distilleryAdded: distillery });
    return distillery;
  }

  @Subscription(() => DistilleryGraphQLModel)
  distilleryAdded() {
    return pubSub.asyncIterator('distilleryAdded');
  }
}
