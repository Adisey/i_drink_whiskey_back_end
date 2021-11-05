import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir } from 'fs-extra';
import { Upload } from 'graphql-upload';
import { createWriteStream, statSync } from 'fs';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { ListArgs } from '../../global/dto/list.args';
import { ConfigService } from '../../configs/app.config.service';
import { getUploadConfig, IGUploadConfig } from '../../configs/upload.config';
import { IMessageType } from '../../apolloError';
import { asyncWebpConvert } from './instruments';
import { FilesDBModel } from './models';
import { FileUploadInfo } from './models/files.model.GraphQL';
import { ISaveFileParams } from './models/files.model';
import { FileDBInfo } from './models/files.model.DB';

@Injectable()
export class FilesService {
  private readonly uploadConfig: Promise<IGUploadConfig>;
  constructor(
    @InjectModel(FilesDBModel)
    private readonly filesModel: ModelType<FilesDBModel>,
    private readonly configService: ConfigService,
  ) {
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

  async savePictureInfo(data: FileDBInfo): Promise<DocumentType<FilesDBModel>> {
    return await this.filesModel.create(data);
  }

  async savePicture({
    uploadFile,
    userName,
  }: ISaveFileParams): Promise<FileUploadInfo> {
    const file: FileUploadInfo = await this.savePicture2Disk(uploadFile);

    if (file.isUpload) {
      const dbInfo = await this.savePictureInfo({
        ...file,
        ownerName: userName,
      });
      if (dbInfo._id) {
        file._id = dbInfo._id.toString();
      } else {
        file.isUpload = false;
        file.errorType = 'FILE_SAVE_DB_INFO_ERROR';
      }
    }

    return file;
  }

  async findAll({
    limit,
    skip,
  }: ListArgs): Promise<DocumentType<FilesDBModel>[]> {
    return await this.filesModel
      .aggregate([{ $limit: skip + limit }, { $skip: skip }])
      .exec();
  }
}
