import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { NewUserInput } from '../../user/models/user.model.GraphQL';

@InputType()
export class Login extends NewUserInput {}

@ObjectType({ description: 'auth' })
export class AuthGraphQLModel {}

@ObjectType({ description: 'auth' })
export class AuthTokenGraphQLModel {
  @Field({ nullable: true })
  access_token: string;
}
