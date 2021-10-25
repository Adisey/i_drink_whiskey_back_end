import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { JwtService } from '@nestjs/jwt';
import { expToken } from 'src/configs/jwt.config';
import { UserDBModel } from 'src/user/models/user.model.DB';

@Injectable()
export class AuthService {
  // ToDo: 25.10.2021 - think about AuthDBModel
  constructor(
    @InjectModel(UserDBModel)
    private readonly userModel: ModelType<UserDBModel>,
    private readonly jwtService: JwtService,
  ) {}

  async getToken(email: string) {
    const payload = {
      email,
      iat: +new Date(),
      nbf: +new Date(),
      exp: expToken(),
    };
    return await this.jwtService.signAsync(payload);
  }
}
