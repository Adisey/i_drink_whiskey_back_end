import { CreateMainDto, MainDBModel } from 'src/common/dto/main.model.DB';

export type CreateCountryDto = CreateMainDto;

export class CountryDBModel extends MainDBModel {}
