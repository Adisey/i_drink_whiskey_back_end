import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';

// Domains
import { CatsModule } from './cats/cats.module';
import { DogsModule } from './dogs/dogs.module';
import { RecipesModule } from './recipes/recipes.module';
import { WhiskyModule } from './whisky/whisky.module';

const dbDatabase = process.env.DB_DATABASE || 'test_2';
const dbIp = process.env.DB_IP || '192.168.50.200';
const dbPort = process.env.DB_PORT || '27017';
const mongoDB = `mongodb://${dbIp}:${dbPort}/${dbDatabase}`;
console.log(+new Date(), `mongoDB:`, mongoDB);

@Module({
  imports: [
    MongooseModule.forRoot(mongoDB, {
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
