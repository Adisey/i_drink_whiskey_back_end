import { Injectable } from '@nestjs/common';
import { FileElementResponse } from 'src/files/models/file-element.reposonse';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir } from 'fs-extra';
import { Upload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { AppConfigService } from 'src/configs/app.config.service';
import { asyncWebpConvert } from 'src/files/instruments';
import { getUploadConfig, IGUploadConfig } from '../configs/upload.config';

@Injectable()
export class FilesService {
  private readonly uploadConfig: Promise<IGUploadConfig>;
  constructor(private readonly appConfigService: AppConfigService) {
    this.uploadConfig = getUploadConfig(appConfigService);
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
