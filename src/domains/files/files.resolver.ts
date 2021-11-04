import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphQLUpload, Upload } from 'graphql-upload';

import { emitGraphQLError, getMessage, IMessageType } from '../../apolloError';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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
  ): Promise<FilesGraphQLModel> {
    const { mimetype, filename } = file;
    console.log(+new Date(), '-()->', typeof mimetype, `-mimetype->`, mimetype);

    if (!checkMimeType(mimetype, 'image')) {
      const errorType: IMessageType = 'FILE_PICTURE_TYPE_BAD';
      console.warn(getMessage(errorType), filename);
      throw emitGraphQLError(errorType);
    }

    const fileInfo = await this.filesService.savePicture(file);

    console.log(+new Date(), '-(FilesResolver)->', `-fileInfo->`, fileInfo);

    if (!fileInfo.isUpload) {
      console.warn(getMessage(fileInfo.errorType), filename);
      throw emitGraphQLError(fileInfo.errorType);
    }

    return { ...fileInfo, message: getMessage(fileInfo.errorType) };
  }
}
