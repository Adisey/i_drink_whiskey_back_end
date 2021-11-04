import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { GraphQLUpload, Upload } from 'graphql-upload';

import { graphQLError } from '../../apolloError';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilesGraphQLModel } from './models';
import { FilesService } from './files.service';
import { checkMimeType } from './instruments';

@Resolver(() => FilesGraphQLModel)
export class FilesResolver {
  constructor(private readonly filesService: FilesService) {}

  @UsePipes(new ValidationPipe())
  @Mutation(() => FilesGraphQLModel)
  @UseGuards(JwtAuthGuard)
  async uploadPicture(
    @Args({ name: 'file', type: () => GraphQLUpload })
    file: Upload,
  ): Promise<FilesGraphQLModel> {
    const { mimetype } = file;
    console.log(+new Date(), '-()->', typeof mimetype, `-mimetype->`, mimetype);

    if (!checkMimeType(mimetype, 'image')) {
      throw graphQLError('isNotPicture');
    }

    const fileInfo = await this.filesService.savePicture(file);

    if (fileInfo.errorType) {
      throw graphQLError(fileInfo.errorType);
    }

    return fileInfo;
  }
}

// dsas
