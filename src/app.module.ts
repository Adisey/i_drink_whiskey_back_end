// Core
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConfig } from 'src/configs/mongo.config';

// Domains
import { AuthModule } from 'src/auth/auth.module';
import { CountryModule } from './country/country.module';
import { FilesModule } from './files/files.module';
import { UserModule } from './user/user.module';
import { WhiskyModule } from './whisky/whisky.module';
import { ShutdownModule } from 'src/shutdown/shutdown.module';
import { AppConfigModule } from 'src/configs/app.config.module';

@Module({
  imports: [
    AppConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      useFactory: getMongoConfig,
    }),
    AuthModule,
    CountryModule,
    FilesModule,
    ShutdownModule,
    UserModule,
    WhiskyModule,
    GraphQLModule.forRoot({
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      context: ({ req }: any) => ({ req }),
    }),
  ],
})
export class AppModule {}
