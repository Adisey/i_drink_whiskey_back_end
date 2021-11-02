import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'file' })
export class FilesGraphQLModel {
  @Field()
  fileName: string;

  @Field({ nullable: true })
  description?: string;
}
