import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min, isISIN, IsIn, IsInt, IsString } from 'class-validator';

@ArgsType()
export class ListArgsOLD {
  @Field((type) => Int)
  @Min(0)
  skip = 0;

  @Field((type) => Int)
  @Min(1)
  @Max(50)
  limit = 25;
}

@ArgsType()
export class ListArgs {
  @Field((type) => Int)
  @Min(1)
  pageNumber = 1;

  @Field((type) => Int)
  @Min(1)
  @Max(50)
  pageSize = 5;

  @Field((type) => String)
  find = '';

  @Field((type) => String)
  sortBy = 'name';

  @Field((type) => Int)
  @IsIn([-1, 1])
  sortOrder = 1;
}
