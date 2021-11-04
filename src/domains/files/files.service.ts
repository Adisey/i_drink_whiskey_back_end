import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir } from 'fs-extra';
import { Upload } from 'graphql-upload';
import { createWriteStream, statSync } from 'fs';

import {} from '../../apolloError';
import { ConfigService } from '../../configs/app.config.service';
import { getUploadConfig, IGUploadConfig } from '../../configs/upload.config';
import { asyncWebpConvert } from './instruments';
import { FileUploadInfo } from './models/files.model.GraphQL';
import { IMessageType } from '../../apolloError';

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
    let errorType: IMessageType = 'FILE_UPLOAD_OK';
    let webpFile = '';
    const { uploadDir } = await this.uploadConfig;
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${uploadDir}/${dateFolder}`;
    const currentPath = path;
    const absoluteFolder = `${currentPath}/${uploadFolder}`;
    await ensureDir(absoluteFolder);
    const uploadFile = `${absoluteFolder}/${filename}`;
    let isUpload = await new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(uploadFile))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false)),
    );

    const { size } = await statSync(uploadFile);

    isUpload = isUpload && size;

    if (!isUpload) {
      errorType = 'FILE_SAVE_ERROR';
    } else {
      webpFile = await asyncWebpConvert(uploadFile);
      if (!webpFile) {
        errorType = 'FILE_CONVERT_WEBP_ERROR';
      }
    }

    return {
      originFileName: filename,
      originFilePath: `${uploadFolder}/${filename}`,
      originFileSize: size,
      webpFilePath: webpFile.replace(currentPath + '/', ''),
      isUpload: !!isUpload,
      mimetype,
      errorType,
    };
  }

  async savePicture(uploadFile: Upload): Promise<FileUploadInfo> {
    const file: FileUploadInfo = await this.savePicture2Disk(uploadFile);

    const fileInfo: FileUploadInfo = {
      ...file,
    };
    console.log(+new Date(), '-(savePicture)->', `-fileInfo->`, fileInfo);
    return fileInfo;
  }
}
