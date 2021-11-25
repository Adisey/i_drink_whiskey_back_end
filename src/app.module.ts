// Core
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConfig } from 'src/configs/mongo.config';

// System
import { AppConfigModule } from './configs/app.config.module';
import { ShutdownModule } from './shutdown/shutdown.module';

// Domains
import { AuthModule } from './domains/auth/auth.module';
import { CountriesModule } from './domains/countries/countries.module';
import { FilesModule } from './domains/files/files.module';
import { RegionsModule } from './domains/regions/regions.module';
import { UsersModule } from 'src/domains/users/users.module';
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
      context: ({ req }: any) => ({ req }),
    }),
    AuthModule,
    CountriesModule,
    FilesModule,
    RegionsModule,
    ShutdownModule,
    UsersModule,
    WhiskyModule,
  ],
})
export class AppModule {}
