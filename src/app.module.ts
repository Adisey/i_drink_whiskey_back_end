import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';

// Domains
import { CatsModule } from './cats/cats.module';
import { DogsModule } from './dogs/dogs.module';
import { RecipesModule } from './recipes/recipes.module';
import { WhiskyModule } from './whisky/whisky.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://192.168.50.200:27017/test_2', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
    CatsModule,
    DogsModule,
    RecipesModule,
    WhiskyModule,
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
    }),
  ],
})
export class AppModule {}
