import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';

export type CreateWhiskyDto = {
  title: string;
  age: number;
  description: string;
};

export interface WhiskyDBModel extends Base {}
export class WhiskyDBModel extends TimeStamps {
  @prop()
  title: string;

  @prop()
  description: string;

  @prop()
  age: number;
}
