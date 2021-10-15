import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'whisky' })
export class Whisky {
  // @Field((type) => ID)
  // id: string;

  @Field({ nullable: true })
  _id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  age: number;

  @Field({ nullable: true })
  creationDate?: Date;
}
