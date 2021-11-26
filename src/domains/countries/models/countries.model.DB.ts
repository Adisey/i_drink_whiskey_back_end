import { MainDBModel } from '../../../common/dto/main.model.DB';
import { index } from '@typegoose/typegoose';

@index({ name: 'text' })
export class CountryDBModel extends MainDBModel {}
