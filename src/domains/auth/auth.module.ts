// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { getJWTConfig } from '../../configs/jwt.config';
import { UsersService } from 'src/domains/users/users.service';
import { UserDBModel } from 'src/domains/users/models/users.model.DB';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

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
    JwtModule.registerAsync({
      useFactory: getJWTConfig,
    }),
    PassportModule,
  ],
  providers: [AuthService, AuthResolver, UsersService],
})
export class AuthModule {}
