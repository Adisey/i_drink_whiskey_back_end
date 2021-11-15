import { Field, ObjectType } from '@nestjs/graphql';

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
}

@ObjectType({ description: 'Upload file' })
export class FilesGraphQLUploadModel extends FilesGraphQLModel {
  @Field({ nullable: true })
  message?: string;
}

@ObjectType({ description: 'File list' })
export class FilesGraphQLListModel {
  @Field(() => [FilesGraphQLModel])
  list: FilesGraphQLModel[];

  @Field()
  totalCount: number;
}
