import { Field, ObjectType } from '@nestjs/graphql';
import { IMessageType } from 'src/apolloError';

export class FileUploadInfo {
  _id?: string;
  isUpload: boolean;
  mimetype: string;
  originFileName: string;
  originFilePath: string;
  originFileSize: number;
  webpFilePath?: string;
  errorType?: IMessageType;
}

@ObjectType({ description: 'file' })
export class FilesGraphQLModel {
  @Field({ nullable: true })
  _id: string;

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
}

export type FilesGraphQLListModel = Omit<FilesGraphQLModel, 'message'>[];
