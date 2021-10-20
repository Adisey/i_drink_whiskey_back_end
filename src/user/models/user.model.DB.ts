import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';

export type CreateUserDto = {
  email: string;
  passwordHash: string;
  role?: string;
};

export interface UserDBModel extends Base {}
export class UserDBModel extends TimeStamps {
  @prop({ unique: true })
  email: string;

  @prop()
  passwordHash: string;

  @prop()
  role?: string;
}
