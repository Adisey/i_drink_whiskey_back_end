import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, Length, MaxLength, IsNotEmpty } from 'class-validator';
import { getMessage } from 'src/apolloError';

@InputType()
export class NewMainInput {
  @Field()
  @MaxLength(30)
  @IsNotEmpty({ message: getMessage('NAME_EMPTY') })
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(1, 255)
  description?: string;
}

@ObjectType()
export class MainGraphQLModel {
  @Field()
  id: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;
}
