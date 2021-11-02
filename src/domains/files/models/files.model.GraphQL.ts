import { Field, ObjectType } from '@nestjs/graphql';

export class FileUploadInfo {
  isUpload: boolean;
  originFileName: string;
  originFilePath: string;
  webpFilePath: string;
  mimetype: string;
  originFileSize: number;
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
}
