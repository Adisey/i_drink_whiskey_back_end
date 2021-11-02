import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir } from 'fs-extra';
import { Upload } from 'graphql-upload';
import { createWriteStream, statSync } from 'fs';

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

  async saveFiles2Disk({
    createReadStream,
    mimetype,
    filename,
  }: Upload): Promise<FileUploadInfo> {
    // const aaa = createReadStream()
    const { uploadDir } = await this.uploadConfig;
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${uploadDir}/${dateFolder}`;
    const currentPath = path;
    const absoluteFolder = `${currentPath}/${uploadFolder}`;
    await ensureDir(absoluteFolder);
    const uploadFile = `${absoluteFolder}/${filename}`;
    const isUpload = await new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(uploadFile))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false)),
    );

    const webpFile = !isUpload
      ? ''
      : (await asyncWebpConvert(uploadFile)) || '';

    const { size } = await statSync(uploadFile);

    return {
      originFileName: filename,
      originFilePath: `${uploadFolder}/${filename}`,
      originFileSize: size,
      webpFilePath: webpFile.replace(currentPath + '/', ''),
      isUpload: !!isUpload,
      mimetype,
    };
  }

  async saveFiles(uploadFile: Upload): Promise<FilesGraphQLModel> {
    // ToDo: 02.11.2021 - add check is Image
    console.log(
      +new Date(),
      '-(saveFiles)-1->',
      typeof uploadFile,
      `-uploadFile->`,
      uploadFile,
    );
    const file: FileUploadInfo = await this.saveFiles2Disk(uploadFile);

    const fileInfo: FilesGraphQLModel = {
      ...file,
    };
    return {
      ...file,
      ownerName: 'Me',
    };
  }
}
