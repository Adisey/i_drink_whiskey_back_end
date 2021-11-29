import { Base } from '@typegoose/typegoose/lib/defaultClasses';

type db = Base & {
  [field: string]: any;
};

type GQL = {
  id: string;
  [field: string]: any;
};

export const db2GQL = (record: db): GQL => ({
  ...record._doc,
  id: record.id,
});
