import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';

export type CreateMainDto = {
  name: string;
  description: string;
};

export interface MainDBModel extends Base {}
export class MainDBModel extends TimeStamps {
  @prop()
  name: string;

  @prop()
  description: string;
}
