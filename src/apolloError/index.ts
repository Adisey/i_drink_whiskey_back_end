import { ApolloError } from 'apollo-server-errors';
import { Logger } from '@nestjs/common';

type IMessageItem = { message: string };
type IMessageList = { [key: string]: IMessageItem };
export type IMessageType = keyof typeof messageList;

const messageList: IMessageList = {
  FILE_PICTURE_TYPE_BAD: { message: 'This file is not picture' },
  FILE_SAVE_ERROR: { message: 'File save error' },
  FILE_CONVERT_WEBP_ERROR: { message: 'Error covert file to webp' },
  FILE_SAVE_DB_INFO_ERROR: { message: 'Error save file info to DB' },
  FILE_UPLOAD_OK: { message: 'Upload Ok' },
};

export const emitGraphQLError = (errorType: IMessageType) => {
  return new ApolloError(messageList[errorType].message, errorType as string);
};
export const getMessage = (errorType: IMessageType): string => {
  return messageList[errorType].message;
};

// ToDo: 04.11.2021 - check by type IMessageType is not work
const errorType: IMessageType = 'FILE_UPLOAD_OK++';

Logger.error('Not Check this ERROR', errorType);

// const aa = getMessage('FILE_PICTURE_TYPE_BAD_xx');
//
// console.log(+new Date(), '-()->', typeof aa, `-aa->`, aa);
