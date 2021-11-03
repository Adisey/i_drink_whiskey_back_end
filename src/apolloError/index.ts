import { ApolloError } from 'apollo-server-errors';

export function graphQLError(errorType: IGraphQLErrorType) {
  return new ApolloError(
    errorList[errorType].message,
    errorList[errorType].code,
  );
}

type IGraphQLErrorCode = 'BAD_FILE_TYPE';
type IGraphQLErrorItem = {
  message: string;
  code: IGraphQLErrorCode;
};

type IGraphQLErrorList = {
  [id: string]: IGraphQLErrorItem;
};
type IGraphQLErrorType = keyof typeof errorList;

const errorList: IGraphQLErrorList = {
  isNotPicture: {
    message: 'This file is not picture',
    code: 'BAD_FILE_TYPE',
  },
};
