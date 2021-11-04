import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { index, prop } from '@typegoose/typegoose';

export class FileDBInfo {
  mimetype: string;
  originFileName: string;
  originFilePath: string;
  originFileSize: number;
  ownerName: string;
  webpFilePath?: string;
}

export interface FilesDBModel extends Base {}
@index({ originFileName: 'text' })
export class FilesDBModel extends TimeStamps {
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
  mimetype: string;

  @prop()
  ownerName: string;
}
