// Core
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypegooseModule } from 'nestjs-typegoose';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { getMongoConfig } from 'src/configs/mongo.config';

// System
import { AppConfigModule } from './configs/app.config.module';
import { ShutdownModule } from './shutdown/shutdown.module';

// Domains
import { AuthModule } from './domains/auth/auth.module';
import { CountriesModule } from './domains/countries/countries.module';
import { DistilleriesModule } from './domains/distilleries/distilleries.module';
import { FilesModule } from './domains/files/files.module';
import { PagesModule } from './domains/pages/pages.module';
import { RegionsModule } from './domains/regions/regions.module';
import { UsersModule } from './domains/users/users.module';
import { WhiskyModule } from './domains/whisky/whisky.module';

@Module({
  imports: [
    AppConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      useFactory: getMongoConfig,
    }),
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      context: ({ req }: any) => ({ req }),
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({
          footer: false,
        }),
      ],
      playground: false,
      cors: {
        origin: 'https://studio.apollographql.com',
        credentials: true,
      },
    }),
    AuthModule,
    CountriesModule,
    DistilleriesModule,
    FilesModule,
    PagesModule,
    RegionsModule,
    ShutdownModule,
    UsersModule,
    WhiskyModule,
  ],
})
export class AppModule {}
