// Core
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongoConfig } from 'src/configs/mongo.config';

// Domains
import { AppConfigModule } from 'src/configs/app.config.service';
import { AuthModule } from 'src/auth/auth.module';
import { CountryModule } from './country/country.module';
import { FilesModule } from './files/files.module';
import { UserModule } from './user/user.module';
import { WhiskyModule } from './whisky/whisky.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AppConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
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
