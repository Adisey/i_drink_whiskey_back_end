// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserDBModel } from './models/user.model.DB';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { AppConfigService } from 'src/configs/app.config.service';

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
  providers: [UserService, UserResolver, JwtStrategy, AppConfigService],
})
export class UserModule {}
