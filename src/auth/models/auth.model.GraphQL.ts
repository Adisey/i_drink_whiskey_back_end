import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { NewUserInput } from 'src/user/models/user.model.GraphQL';

@InputType()
export class LoginUser extends NewUserInput {}

@ObjectType({ description: 'auth' })
export class AuthGraphQLModel {}

@ObjectType({ description: 'auth' })
export class AuthTokenGraphQLModel {
  @Field({ nullable: true })
  access_token: string;
}
