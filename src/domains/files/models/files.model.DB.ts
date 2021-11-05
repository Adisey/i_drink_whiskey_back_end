import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { index, prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { Upload } from 'graphql-upload';

import { IMessageType } from '../../../apolloError';

export type ISaveFileParams = {
  uploadFile: Upload;
  userName: string;
};

export class FileDBInfo {
  mimetype?: string;
  originFileName: string;
  originFilePath?: string;
  originFileSize?: number;
  ownerName?: string;
  webpFilePath?: string;
}

export class FileUploadInfo extends FileDBInfo {
  _id?: Types.ObjectId;
  isUpload: boolean;
  errorType?: IMessageType;
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
