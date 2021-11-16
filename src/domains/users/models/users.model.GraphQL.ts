import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class AddUserInput {
  @Field()
  @Length(5, 30)
  email: string;

  @Field()
  @Length(2, 30)
  password?: string;
}

@ObjectType({ description: 'User' })
export class UserGraphQLModel {
  @Field()
  email: string;

  @Field({ nullable: true })
  role?: string;
}
