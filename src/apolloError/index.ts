import { ApolloError } from 'apollo-server-errors';

const messageList = {
  FILE_PICTURE_TYPE_BAD: 'This file is not picture',
  FILE_SAVE_ERROR: 'File save error',
  FILE_CONVERT_WEBP_ERROR: 'Error covert file to webp',
  FILE_SAVE_DB_INFO_ERROR: 'Error save file info to DB',
  FILE_UPLOAD_OK: 'Upload Ok',
};

export type IMessageType = keyof typeof messageList;

export const getMessage = (errorType: IMessageType): string => {
  return messageList[errorType];
};

export const emitGraphQLError = (errorType: IMessageType) => {
  return new ApolloError(getMessage(errorType), errorType as string);
};
