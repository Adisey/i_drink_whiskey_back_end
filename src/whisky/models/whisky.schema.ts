import * as mongoose from 'mongoose';

export const WhiskySchema = new mongoose.Schema({
  title: String,
  age: Number,
  description: String,
  creationDate: Date,
});
