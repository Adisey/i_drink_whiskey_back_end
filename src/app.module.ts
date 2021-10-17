// Core
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

// Domains
import { CatsModule } from './cats/cats.module';
import { RecipesModule } from './recipes/recipes.module';

import { WhiskyModule } from './whisky/whisky.module';

dotenv.config();

const dbDatabase = process.env.DB_DATABASE || 'test';
const dbUrl = process.env.DB_URL || 'localhost';
const dbPort = process.env.DB_PORT || '27017';
const mongoDB = `mongodb://${dbUrl}:${dbPort}/${dbDatabase}`;
console.log(+new Date(), `mongoDB:`, mongoDB);

@Module({
  imports: [
    MongooseModule.forRoot(mongoDB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
    CatsModule,
    RecipesModule,
    WhiskyModule,
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
    }),
  ],
})
export class AppModule {}
