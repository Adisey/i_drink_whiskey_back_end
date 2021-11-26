import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';

export interface MainDBModel extends Base {}
export class MainDBModel extends TimeStamps {
  @prop({ unique: true, required: true })
  name: string;

  @prop()
  description: string;
}
