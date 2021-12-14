// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
//Main
import { getDbModule } from '../dbModule';
import { ConfigService } from '../../configs/app.config.service';
//Domains
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
//Local
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypegooseModule.forFeature([getDbModule('Users')])],
  providers: [UsersService, UsersResolver, JwtStrategy, ConfigService],
})
export class UsersModule {}
