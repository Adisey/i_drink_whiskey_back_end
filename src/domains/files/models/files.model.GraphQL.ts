import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { GraphQLListModel, ListArgs } from 'src/common/dto/listArgs';

@ObjectType({ description: 'file' })
export class FileGraphQLModel {
  @Field({ nullable: true })
  id: string;

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

type FileGraphQLField = keyof FileGraphQLModel;

@ObjectType({ description: 'Upload file' })
export class FilesGraphQLUploadModel extends FileGraphQLModel {
  @Field({ nullable: true })
  message?: string;
}

@ObjectType({ description: 'File list' })
export class FilesGraphQLListModel extends GraphQLListModel {
  @Field(() => [FileGraphQLModel])
  list: FileGraphQLModel[];
}

// type IFilesSortBy = 'originFileName' | 'originFileSize' | 'ownerName';

@ArgsType()
export class FileListArgs extends ListArgs {
  // ToDo: 15.11.2021 - add check fields
  @Field(() => String)
  sortBy: FileGraphQLField = 'originFileName';
}
