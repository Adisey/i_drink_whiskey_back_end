import { Injectable } from '@nestjs/common';
import { FileElementResponse } from 'src/files/models/file-element.reposonse';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir } from 'fs-extra';
import { Upload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { asyncWebpConvert } from 'src/files/instruments';

@Injectable()
export class FilesService {
  async saveFiles2({
    createReadStream,
    filename,
  }: Upload): Promise<FileElementResponse> {
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${path}/uploads/${dateFolder}`;
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
