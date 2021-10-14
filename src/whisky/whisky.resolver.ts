// import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
// import { PubSub } from 'graphql-subscriptions';
// import { NewRecipeInput } from './dto/new-recipe.input';
// import { ListArgs } from './dto/recipes.args';
import { Whisky } from './models/whisky.model';
import { WhiskyService } from './whisky.service';
import { ListArgs } from 'src/global/dto/list.args';

// const pubSub = new PubSub();

@Resolver((of) => Whisky)
export class WhiskyResolver {
  constructor(private readonly whiskyService: WhiskyService) {}

  // @Query((returns) => Recipe)
  // async recipe(@Args('id') id: string): Promise<Recipe> {
  //   const recipe = await this.recipesService.findOneById(id);
  //   if (!recipe) {
  //     throw new NotFoundException(id);
  //   }
  //   return recipe;
  // }
  //
  @Query((returns) => [Whisky])
  async whiskyList(@Args() listArgs: ListArgs): Promise<Whisky[]> {
    const aaa = await this.whiskyService.findAll(listArgs);
    console.log(+new Date(), '-(whiskyList)->', typeof aaa, `-aaa->`, aaa);
    return aaa;
  }
  //
  // @Mutation((returns) => Recipe)
  // async addRecipe(
  //   @Args('newRecipeData') newRecipeData: NewRecipeInput,
  // ): Promise<Recipe> {
  //   const recipe = await this.recipesService.create(newRecipeData);
  //   pubSub.publish('recipeAdded', { recipeAdded: recipe });
  //   return recipe;
  // }
  //
  // @Mutation((returns) => Boolean)
  // async removeRecipe(@Args('id') id: string) {
  //   return this.recipesService.remove(id);
  // }
  //
  // @Subscription((returns) => Recipe)
  // recipeAdded() {
  //   return pubSub.asyncIterator('recipeAdded');
  // }
}
