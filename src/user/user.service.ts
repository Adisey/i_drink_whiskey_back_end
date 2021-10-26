import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { ListArgs } from '../global/dto/list.args';
import { IDbCreateUser, UserDBModel } from './models/user.model.DB';
import { isRoleAdmin } from 'src/configs/auth.config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserDBModel)
    private readonly userModel: ModelType<UserDBModel>,
  ) {}

  async create(data: IDbCreateUser): Promise<DocumentType<UserDBModel>> {
    return await this.userModel.create(data);
  }

  async findUserByRole(role: string): Promise<DocumentType<UserDBModel>> {
    return await this.userModel.findOne({ role }).exec();
  }

  async findUserByEmail(email: string): Promise<DocumentType<UserDBModel>> {
    return await this.userModel.findOne({ email }).exec();
  }

  async isUserAdmin(email: string): Promise<boolean> {
    const user = await this.findUserByEmail(email);
    return isRoleAdmin(user.role);
  }

  async deleteByEmail(
    email: string,
  ): Promise<DocumentType<UserDBModel> | null> {
    return await this.userModel.findOneAndDelete({ email }).exec();
  }

  async findAll({
    limit,
    skip,
  }: ListArgs): Promise<DocumentType<UserDBModel>[]> {
    // ToDo: 14.10.2021 - Add pagination
    // ToDo: 27.10.2021 - Add total for responce
    return this.userModel
      .aggregate([{ $limit: skip + limit }, { $skip: skip }])
      .exec();
  }

  async updateById(id: string, dto: IDbCreateUser) {
    return this.userModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }
}
