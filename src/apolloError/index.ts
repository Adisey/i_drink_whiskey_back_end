import { ApolloError } from 'apollo-server-errors';
import { Logger } from '@nestjs/common';

const messageList = {
  FILE_CONVERT_WEBP_ERROR: 'Error covert file to webp',
  FILE_PICTURE_TYPE_BAD: 'This file is not picture',
  FILE_SAVE_DB_INFO_ERROR: 'Error save file info to DB',
  FILE_SAVE_ERROR: 'File save error',
  FILE_UPLOAD_OK: 'Upload Ok',
  NAME_DUPLICATE: 'Name should not be duplicate!',
  NAME_EMPTY: 'Name should not be empty!',
  RIGHTS_NOT_ENOUGH: 'You are not enough rights for this operation.',
  TOKEN_INVALID: 'Could not authenticate with token!',
  USER_ADMIN_ONLY: 'Only for users with admin rights!',
  USER_BAD: 'Could not log-in with the provided credentials!',
  USER_NOT_FOUND: 'User not found!',
  USER_ONLY: 'Only for registered users!',
  WB_DUPLICATE: 'Whisky Base Id should not be duplicate!',
};

export type IMessageType = keyof typeof messageList;

export const getMessage = (errorType: IMessageType): string => {
  return messageList[errorType];
};

export const emitGraphQLError = (
  errorType: IMessageType,
  context: string,
  ...descriptions: string[]
) => {
  const message = getMessage(errorType);
  Logger.warn(message, context);
  descriptions.forEach((description) =>
    Logger.warn(`description: ${description}`, context),
  );

  return new ApolloError(message);
};
