// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { ConfigService } from '../../configs/app.config.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UsersResolver } from 'src/domains/users/users.resolver';
import { UsersService } from 'src/domains/users/users.service';
import { UserDBModel } from 'src/domains/users/models/users.model.DB';

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
