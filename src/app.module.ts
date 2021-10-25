// Core
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongoConfig } from 'src/configs/mongo.config';

// Domains
import { AuthModule } from 'src/auth/auth.module';
import { CountryModule } from './country/country.module';
import { UserModule } from './user/user.module';
import { WhiskyModule } from './whisky/whisky.module';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypegooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig,
    }),
    AuthModule,
    CountryModule,
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
