// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { getJWTConfig } from 'src/configs/jwt.config';
import { UserService } from 'src/user/user.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UserDBModel } from 'src/user/models/user.model.DB';

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
