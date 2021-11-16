import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import { IsIn } from 'class-validator';
import { ListArgs } from 'src/global/dto/listArgs';

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

@ArgsType()
export class FileListArgs extends ListArgs {
  // ToDo: 15.11.2021 - add check fields
  @Field((type) => String)
  sortBy = 'originFileName';

  @Field((type) => Int)
  @IsIn([-1, 1])
  sortOrder = 1;
}
