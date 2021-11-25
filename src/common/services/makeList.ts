import { ModelType } from '@typegoose/typegoose/lib/types';
import { GraphQLListModel, ListArgs } from 'src/common/dto/listArgs';

export const makeList = async <M>(
  model: ModelType<M>,
  listArgs: ListArgs,
): Promise<GraphQLListModel> => {
  const { pageNumber, pageSize, find, sortBy, sortOrder } = listArgs;

  const findQuery = find ? { $text: { $search: '$' + find + '$' } } : {};
  const sortField = `${sortOrder > 0 ? '' : '-'}${sortBy}`;

  const count = await model.aggregate().match(findQuery).count('count').exec();

  const skip = pageNumber ? (pageNumber - 1) * pageSize : pageNumber;

  const list = await model
    .aggregate()
    .match(findQuery)
    .sort(sortField)
    .skip(skip)
    .limit(pageSize)
    .exec();

  return {
    list,
    totalCount: count[0]?.count || 0,
  };
};
