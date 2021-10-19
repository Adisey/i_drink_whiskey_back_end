import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop } from '@typegoose/typegoose';

export class CreateCountryDto {
  name: string;
  description: string;
}

export interface CountryDBModel extends Base {}
export class CountryDBModel extends TimeStamps {
  @prop()
  name: string;

  @prop()
  description: string;
}
