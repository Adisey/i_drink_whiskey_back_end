import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { GraphQLListModel, ListArgs } from 'src/common/dto/listArgs';

@InputType()
export class AddUserInput {
  @Field()
  @Length(5, 30)
  email: string;

  @Field()
  @Length(2, 30)
  password?: string;
}

@ObjectType({ description: 'Users list' })
export class UsersGraphQLListModel extends GraphQLListModel {
  @Field(() => [UserGraphQLModel])
  list: UserGraphQLModel[];
}

@ObjectType({ description: 'User' })
export class UserGraphQLModel {
  @Field()
  email: string;

  @Field({ nullable: true })
  role?: string;
}

@ArgsType()
export class UsersListArgs extends ListArgs {
  // ToDo: 19.11.2021 - add check fields
  @Field(() => String)
  sortBy = 'email';
}
