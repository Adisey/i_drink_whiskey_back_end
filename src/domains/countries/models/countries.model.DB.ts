import { CreateMainDto, MainDBModel } from '../../../common/dto/main.model.DB';
import { index } from '@typegoose/typegoose';

// ToDo: 25.11.2021 - compare with region
export type CreateCountryDto = CreateMainDto;

@index({ name: 'text' })
export class CountryDBModel extends MainDBModel {}
