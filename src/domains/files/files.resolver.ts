import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLUpload, Upload } from 'graphql-upload';
import { emitGraphQLError, getMessage, IMessageType } from '../../apolloError';

import { ListArgs } from '../../global/dto/list.args';
import { AdminGuard, JwtAuthGuard } from '../auth/guards/';
import { CurrentUserName } from '../auth/instruments';
import { FilesGraphQLModel } from './models';
import { FilesService } from './files.service';
import { checkMimeType } from './instruments';

@Resolver(() => FilesGraphQLModel)
export class FilesResolver {
  constructor(private readonly filesService: FilesService) {}

  @Mutation(() => FilesGraphQLModel)
  @UseGuards(JwtAuthGuard)
  async uploadPicture(
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: Upload,
    @CurrentUserName() ownerName: string,
  ): Promise<FilesGraphQLModel> {
    const { mimetype, filename } = file;

    if (!checkMimeType(mimetype, 'image')) {
      const errorType: IMessageType = 'FILE_PICTURE_TYPE_BAD';
      console.warn(getMessage(errorType), filename);
      throw emitGraphQLError(errorType);
    }

    const fileInfo = await this.filesService.savePicture({
      uploadFile: file,
      userName: ownerName,
    });

    if (!fileInfo.isUpload) {
      console.warn(getMessage(fileInfo.errorType), filename);
      throw emitGraphQLError(fileInfo.errorType);
    }

    return {
      ...fileInfo,
      message: getMessage(fileInfo.errorType),
      ownerName,
      _id: fileInfo._id.toString(),
    };
  }

  @Query(() => [FilesGraphQLModel])
  @UseGuards(JwtAuthGuard, AdminGuard)
  async pictureList(@Args() listArgs: ListArgs): Promise<FilesGraphQLModel[]> {
    return (await this.filesService.findAll(listArgs)).map((i) => ({
      ...i,
      _id: i._id.toString(),
    }));
  }
}
