import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphQLUpload, Upload } from 'graphql-upload';
import { FilesGraphQLModel } from './models';
import { FilesService } from './files.service';

@Resolver(() => FilesGraphQLModel)
export class FilesResolver {
  constructor(private readonly filesService: FilesService) {}

  @Mutation(() => FilesGraphQLModel)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: Upload,
  ): Promise<FilesGraphQLModel> {
    console.log(+new Date(), '-(1)->', typeof file, `-file->`, file);

    const aaa = await this.filesService.saveFiles2(file);

    return { fileName: aaa.name, description: aaa.url };
  }
}
