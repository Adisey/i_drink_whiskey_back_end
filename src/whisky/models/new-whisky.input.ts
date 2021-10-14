import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, Length, MaxLength } from 'class-validator';

@InputType()
export class NewWhiskyInput {
  @Field()
  @MaxLength(30)
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @Length(30, 255)
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  age: number;

  @Field({ nullable: true })
  @IsOptional()
  creationDate?: Date;
}
