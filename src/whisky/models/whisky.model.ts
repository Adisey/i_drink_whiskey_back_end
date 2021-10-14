import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'whisky' })
export class Whisky {
  @Field((type) => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  age: Number;

  @Field()
  creationDate: Date;
}
