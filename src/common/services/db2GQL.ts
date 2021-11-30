import { Base } from '@typegoose/typegoose/lib/defaultClasses';

type db = Base & {
  [field: string]: any;
};

type GQL = {
  id: string;
  [field: string]: any;
};

// ToDo: 30.11.2021 - delete this

export const db2GQL = (record: db): GQL => ({
  ...record._doc,
  id: record.id,
});
