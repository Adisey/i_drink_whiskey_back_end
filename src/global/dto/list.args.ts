import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

@ArgsType()
export class ListArgs {
  @Field((type) => Int)
  @Min(0)
  skip = 0;

  @Field((type) => Int)
  @Min(1)
  @Max(50)
  limit = 25;
}

@ArgsType()
export class ListArgsNEW {
  @Field((type) => Int)
  @Min(1)
  pageNumber = 1;

  @Field((type) => Int)
  @Min(1)
  @Max(50)
  pageSize = 5;

  @Field((type) => String)
  find = '';
}
