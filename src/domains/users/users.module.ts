// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { ConfigService } from '../../configs/app.config.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UserDBModel } from './models/users.model.DB';

@Module({
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserDBModel,
        schemaOptions: {
          collection: 'Users',
        },
      },
    ]),
  ],
  providers: [UsersService, UsersResolver, JwtStrategy, ConfigService],
})
export class UsersModule {}
