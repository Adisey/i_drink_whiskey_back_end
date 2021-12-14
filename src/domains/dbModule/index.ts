//Core
import { TypegooseClassWithOptions } from 'nestjs-typegoose/dist/typegoose-class.interface';
//Domains
import { CountryDBModel } from '../countries/models/countries.model.DB';
import { DistilleryDBModel } from '../distilleries/models/distilleries.model.DB';
import { RegionDBModel } from '../regions/models/regions.model.DB';
import { UserDBModel } from '../users/models/users.model.DB';
import { WhiskyDBModel } from '../whisky/models/whisky.model.DB';

type ICollectionName =
  | 'Countries'
  | 'Distilleries'
  | 'Regions'
  | 'Users'
  | 'Whisky';

interface IDbModule extends TypegooseClassWithOptions {
  schemaOptions: {
    collection: ICollectionName;
  };
}

const dbModules: IDbModule[] = [
  {
    typegooseClass: CountryDBModel,
    schemaOptions: {
      collection: 'Countries',
    },
  },
  {
    typegooseClass: DistilleryDBModel,
    schemaOptions: {
      collection: 'Distilleries',
    },
  },
  {
    typegooseClass: RegionDBModel,
    schemaOptions: {
      collection: 'Regions',
    },
  },
  {
    typegooseClass: UserDBModel,
    schemaOptions: {
      collection: 'Users',
    },
  },
  {
    typegooseClass: WhiskyDBModel,
    schemaOptions: {
      collection: 'Whisky',
    },
  },
];

export const getDbModule = (
  collectionName: ICollectionName,
): TypegooseClassWithOptions => {
  return dbModules.find(
    (i: IDbModule) => i.schemaOptions.collection === collectionName,
  );
};
