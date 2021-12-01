import { index, prop } from '@typegoose/typegoose';
import { MainDBModel } from 'src/common/dto/main.model.DB';

@index({ name: 'text' })
export class WhiskyDBModel extends MainDBModel {
  @prop()
  age: number;

  //
  // @Field({ nullable: true })
  // creationDate?: Date;

  @prop()
  distilleryId: string;
}
