import { index, prop } from '@typegoose/typegoose';
import { MainDBModel } from '../../../common/dto/main.model.DB';

@index({ name: 'text' })
export class DistilleryDBModel extends MainDBModel {
  @prop()
  regionId: string;
}
