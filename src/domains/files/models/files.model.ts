import { Upload } from 'graphql-upload';
import { IMessageType } from 'src/apolloError';

export type ISaveFileParams = {
  uploadFile: Upload;
  userName: string;
};
