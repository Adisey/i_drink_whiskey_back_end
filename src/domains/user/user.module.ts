// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { ConfigService } from '../../configs/app.config.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserDBModel } from './models/user.model.DB';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserDBModel,
        schemaOptions: {
          collection: 'User',
        },
      },
    ]),
  ],
  // ToDo: 25.10.2021 - move JwtStrategy & ConfigService to UP
  providers: [UserService, UserResolver, JwtStrategy, ConfigService],
})
export class UserModule {}
