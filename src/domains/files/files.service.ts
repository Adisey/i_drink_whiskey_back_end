import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir } from 'fs-extra';
import { Upload } from 'graphql-upload';
import { createWriteStream, statSync } from 'fs';

import { graphQLMessage } from '../../apolloError';
import { ConfigService } from '../../configs/app.config.service';
import { getUploadConfig, IGUploadConfig } from '../../configs/upload.config';
import { asyncWebpConvert } from './instruments';
import {
  FilesGraphQLModel,
  FileUploadInfo,
} from './models/files.model.GraphQL';

@Injectable()
export class FilesService {
  private readonly uploadConfig: Promise<IGUploadConfig>;
  constructor(private readonly configService: ConfigService) {
    this.uploadConfig = getUploadConfig(configService);
  }

  async savePicture2Disk({
    createReadStream,
    mimetype,
    filename,
  }: Upload): Promise<FileUploadInfo> {
    let message = graphQLMessage('uploadOk');
    let errorType = 'fileSaveError';
    const { uploadDir } = await this.uploadConfig;
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${uploadDir}/${dateFolder}`;
    const currentPath = path;
    const absoluteFolder = `${currentPath}/${uploadFolder}`;
    await ensureDir(absoluteFolder);
    const uploadFile = `${absoluteFolder}/${filename}`;
    console.log(+new Date(), `-uploadFile->`, uploadFile);
    const isUpload = await new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(uploadFile))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false)),
    );
    console.log(+new Date(), '-()->', typeof isUpload, `-isUpload->`, isUpload);

    if (!isUpload) {
      errorType = 'fileSaveError';
    }

    const webpFile = !isUpload
      ? ''
      : (await asyncWebpConvert(uploadFile)) || '';

    if (!webpFile) {
      message = graphQLMessage('convertWebpError');
      console.warn(message, filename);
    }

    const { size } = await statSync(uploadFile);

    if (!isUpload) {
      errorType = 'fileSaveError';
    }

    return {
      originFileName: filename,
      originFilePath: `${uploadFolder}/${filename}`,
      originFileSize: size,
      webpFilePath: webpFile.replace(currentPath + '/', ''),
      isUpload: !!isUpload,
      mimetype,
      message,
      errorType,
    };
  }

  async savePicture(uploadFile: Upload): Promise<FilesGraphQLModel> {
    const file: FileUploadInfo = await this.savePicture2Disk(uploadFile);

    const fileInfo: FilesGraphQLModel = {
      ...file,
      ownerName: 'Me',
      errorType: file.errorType as string,
    };
    return fileInfo;
  }
}
