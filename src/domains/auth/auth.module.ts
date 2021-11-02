// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { getJWTConfig } from '../../configs/jwt.config';
import { UserService } from '../user/user.service';
import { UserDBModel } from '../user/models/user.model.DB';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

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
    JwtModule.registerAsync({
      useFactory: getJWTConfig,
    }),
    PassportModule,
  ],
  providers: [AuthService, AuthResolver, UserService],
})
export class AuthModule {}
