import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, Length, MaxLength } from 'class-validator';

@InputType()
export class NewWhiskyInput {
  @Field()
  @MaxLength(30)
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(1, 255)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  age: number;

  @Field({ nullable: true })
  @IsOptional()
  creationDate?: Date;
}

@ObjectType({ description: 'whisky' })
export class WhiskyGraphQLModel {
  @Field({ nullable: true })
  _id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  age: number;
}
