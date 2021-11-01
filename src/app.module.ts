// Core
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from '@nestjs/config';
import { getMongoConfig } from 'src/configs/mongo.config';

// Domains
import { AuthModule } from 'src/auth/auth.module';
import { CountryModule } from './country/country.module';
import { FilesModule } from './files/files.module';
import { UserModule } from './user/user.module';
import { WhiskyModule } from './whisky/whisky.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      useFactory: getMongoConfig,
    }),
    AuthModule,
    CountryModule,
    FilesModule,
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
