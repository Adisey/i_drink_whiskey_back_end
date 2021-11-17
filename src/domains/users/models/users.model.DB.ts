import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { index, prop } from '@typegoose/typegoose';

export type IDbCreateUser = {
  email: string;
  passwordHash: string;
  roleId?: string;
};

export interface UserDBModel extends Base {}
@index({ email: 'text' })
export class UserDBModel extends TimeStamps {
  @prop({ unique: true })
  email: string;

  @prop()
  passwordHash: string;

  @prop()
  roleId?: string;
}
