import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import {
  DistilleryGraphQLModel,
  NewDistilleryInput,
} from '../../distilleries/models/distilleries.model.GraphQL';

@InputType()
export class NewWhiskyInput extends NewDistilleryInput {
  @Field({ nullable: true })
  @IsOptional()
  age: number;

  @Field({ nullable: true })
  @IsOptional()
  creationDate?: Date;

  @Field({ nullable: true })
  distilleryId?: string;

  @Field({ nullable: true })
  distillery?: string;
}

@ObjectType({ description: 'whisky' })
export class WhiskyGraphQLModel extends DistilleryGraphQLModel {
  @Field({ nullable: true })
  age?: number;

  @Field({ nullable: true })
  creationDate?: Date;

  @Field({ nullable: true })
  distilleryId?: string;
}
