import { Document } from 'mongoose';

export interface IWhiskyDB extends Document {
  readonly _id: string;
  readonly title: string;
  readonly age: number;
  readonly description: string;
  readonly creationDate?: Date;
}
