// Core
import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { UserResolver } from 'src/user/user.resolver';
import { UserService } from 'src/user/user.service';
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
  ],
  providers: [UserService, UserResolver],
})
export class UserModule {}
