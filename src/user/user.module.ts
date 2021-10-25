// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { UserDBModel } from './models/user.model.DB';
import { JwtStrategy } from 'src/auth/jwt.strategy';

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
  // ToDo: 25.10.2021 - move JwtStrategy UP
  providers: [UserService, UserResolver, JwtStrategy],
})
export class UserModule {}
