import { index, prop } from '@typegoose/typegoose';
import { MainDBModel } from 'src/common/dto/main.model.DB';

@index({ name: 'text', WD: 'text' })
export class WhiskyDBModel extends MainDBModel {
  @prop({ unique: false, required: true })
  name: string;

  @prop()
  age: number;

  @prop()
  distilleryId: string;

  @prop()
  WB: string;
}
