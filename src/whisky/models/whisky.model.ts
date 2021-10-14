import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'whisky' })
export class Whisky {
  @Field((type) => ID)
  id: string;

  // @Field()
  // id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  age: number;

  @Field()
  creationDate?: Date;
}
