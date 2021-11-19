import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { GraphQLUpload, Upload } from 'graphql-upload';
import { emitGraphQLError, getMessage, IMessageType } from '../../apolloError';

import { User } from '../auth/decorators/user.decorator';
import { AdminGuard } from '../auth/guards/';
import { FilesGraphQLListModel, FileGraphQLModel } from './models';
import { FilesService } from './files.service';
import { checkMimeType } from './instruments';
import {
  FileListArgs,
  FilesGraphQLUploadModel,
} from 'src/domains/files/models/files.model.GraphQL';

@Resolver(() => FileGraphQLModel)
export class FilesResolver {
  constructor(private readonly filesService: FilesService) {}

  @Mutation(() => FilesGraphQLUploadModel, {
    description: getMessage('USER_ONLY'),
  })
  // @UsePipes(new ValidationPipe())
  async uploadPicture(
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: Upload,
    @User('email') ownerName: string,
  ): Promise<FilesGraphQLUploadModel> {
    const { mimetype, filename } = file;

    if (!checkMimeType(mimetype, 'image')) {
      const errorType: IMessageType = 'FILE_PICTURE_TYPE_BAD';
      throw emitGraphQLError(errorType, 'uploadPicture', filename);
    }

    const fileInfo = await this.filesService.savePicture({
      uploadFile: file,
      userName: ownerName,
    });

    if (!fileInfo.isUpload) {
      throw emitGraphQLError(fileInfo.errorType, 'uploadPicture', filename);
    }

    return {
      ...fileInfo,
      message: getMessage(fileInfo.errorType),
      ownerName,
      _id: fileInfo._id.toString(),
    };
  }

  @Query(() => FilesGraphQLListModel, {
    description: getMessage('USER_ADMIN_ONLY'),
  })
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe())
  async pictureList(
    @Args() listArgs: FileListArgs,
  ): Promise<FilesGraphQLListModel> {
    return await this.filesService.findAll(listArgs);
  }
}
