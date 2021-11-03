import { Field, ObjectType } from '@nestjs/graphql';
import { IGraphQLErrorType } from 'src/apolloError';

export class FileUploadInfo {
  isUpload: boolean;
  message: string;
  mimetype: string;
  originFileName: string;
  originFilePath: string;
  originFileSize: number;
  webpFilePath: string;
  errorType?: IGraphQLErrorType;
}

@ObjectType({ description: 'file' })
export class FilesGraphQLModel {
  @Field({ nullable: true })
  originFileName: string;

  @Field({ nullable: true })
  originFilePath?: string;

  @Field({ nullable: true })
  webpFilePath?: string;

  @Field({ nullable: true })
  originFileSize?: number;

  @Field({ nullable: true })
  mimetype?: string;

  @Field({ nullable: true })
  ownerName?: string;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  errorType?: string;
}
