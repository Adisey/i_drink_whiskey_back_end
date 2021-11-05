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
import { CountryModule } from './domains/country/country.module';
import { FilesModule } from './domains/files/files.module';
import { UserModule } from './domains/user/user.module';
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
    CountryModule,
    FilesModule,
    ShutdownModule,
    UserModule,
    WhiskyModule,
  ],
})
export class AppModule {}
