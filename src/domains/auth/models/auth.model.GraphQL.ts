import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { AddUserInput } from 'src/domains/users/models/users.model.GraphQL';

@InputType()
export class Login extends AddUserInput {}

@ObjectType({ description: 'auth' })
export class AuthGraphQLModel {}

@ObjectType({ description: 'auth' })
export class AuthTokenGraphQLModel {
  @Field({ nullable: true })
  access_token: string;
}
