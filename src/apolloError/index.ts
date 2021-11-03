import { ApolloError } from 'apollo-server-errors';

export function graphQLError(errorType: IGraphQLErrorType) {
  return new ApolloError(
    errorList[errorType].message,
    errorList[errorType].code,
  );
}

type IGraphQLErrorCode = 'FILE_TYPE_BAD' | 'FILE_SAVE_ERROR';
type IGraphQLErrorItem = {
  message: string;
  code: IGraphQLErrorCode;
};

type IGraphQLErrorList = {
  [id: string]: IGraphQLErrorItem;
};

export type IGraphQLErrorType = keyof typeof errorList;

const errorList: IGraphQLErrorList = {
  fileIsNotPicture: {
    message: 'This file is not picture',
    code: 'FILE_TYPE_BAD',
  },
  fileSaveError: {
    message: 'File save error',
    code: 'FILE_SAVE_ERROR',
  },
};

export function graphQLMessage(messageType: IGraphQLMessageType) {
  return messageList[messageType];
}

type IGraphQLMessageType = keyof typeof messageList;

type IGraphQLMessageList = {
  [id: string]: string;
};

const messageList: IGraphQLMessageList = {
  uploadOk: 'Upload Ok',
  convertWebpError: 'Error covert file to webp',
};
