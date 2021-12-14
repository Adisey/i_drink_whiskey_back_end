import { ModelType } from '@typegoose/typegoose/lib/types';
import { GraphQLListModel, ListArgs } from 'src/common/dto/listArgs';

export const makeList = async <M>(
  model: ModelType<M>,
  listArgs: ListArgs,
): Promise<GraphQLListModel> => {
  const {
    pageNumber,
    pageSize,
    find,
    sortBy = 'name',
    sortOrder = 1,
  } = listArgs;
  const findQuery = find ? { $text: { $search: '$' + find + '$' } } : {};
  const count = await model.aggregate().match(findQuery).count('count').exec();
  const skip = pageNumber ? (pageNumber - 1) * pageSize : pageNumber;
  const sort = {};
  if (sortBy === 'name' && model.collection.name === 'Files') {
    sort['originFileName'] = sortOrder;
  } else {
    sort[sortBy] = sortOrder;
  }

  const list = await model
    .aggregate()
    .match(findQuery)
    .sort(sort)
    .skip(skip)
    .limit(pageSize)
    .exec();

  return {
    list: list.map((i) => ({ ...i, id: i._id.toString() })),
    totalCount: count[0]?.count || 0,
  };
};
