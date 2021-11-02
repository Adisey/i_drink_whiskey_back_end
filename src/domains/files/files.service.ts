import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir } from 'fs-extra';
import { Upload } from 'graphql-upload';
import { createWriteStream } from 'fs';

import { ConfigService } from '../../configs/app.config.service';
import { getUploadConfig, IGUploadConfig } from '../../configs/upload.config';
import { asyncWebpConvert } from './instruments';
import { FileElementResponse } from './models/file-element.reposonse';

@Injectable()
export class FilesService {
  private readonly uploadConfig: Promise<IGUploadConfig>;
  constructor(private readonly configService: ConfigService) {
    this.uploadConfig = getUploadConfig(configService);
  }

  async saveFiles2({
    createReadStream,
    filename,
  }: Upload): Promise<FileElementResponse> {
    const { uploadDir } = await this.uploadConfig;
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${path}/${uploadDir}/${dateFolder}`;
    await ensureDir(uploadFolder);
    const uploadFile = `${uploadFolder}/${filename}`;
    const isSaved = await new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(uploadFile))
        .on('finish', () => resolve(true))
        .on('error', () => reject(false)),
    );

    const outFile = !isSaved
      ? ''
      : (await asyncWebpConvert(uploadFile)) || uploadFile;

    return { name: filename, url: outFile };
  }
}
