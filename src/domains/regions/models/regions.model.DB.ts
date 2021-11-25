import { MainDBModel } from '../../../common/dto/main.model.DB';
import { index, prop } from '@typegoose/typegoose';

@index({ name: 'text' })
export class RegionDBModel extends MainDBModel {
  @prop()
  countryId: string;
}
