import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, Length, MaxLength } from 'class-validator';

@InputType()
export class NewMainInput {
  @Field()
  @MaxLength(30)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(30, 255)
  description?: string;
}

@ObjectType()
export class MainGraphQLModel {
  @Field({ nullable: true })
  _id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;
}
