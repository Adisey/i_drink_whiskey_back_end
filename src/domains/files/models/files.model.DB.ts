import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { index, prop } from '@typegoose/typegoose';

export interface FilesDBModel extends Base {}
@index({ originFileName: 'text' })
export class FilesDBModel extends TimeStamps {
  // @prop({ unique: true })
  @prop()
  originFileName: string;

  @prop()
  originFilePath: string;

  @prop()
  webpFilePath: string;

  @prop()
  originFileSize: number;

  @prop()
  originFileDate: string;

  @prop()
  ownerName: string;
}
