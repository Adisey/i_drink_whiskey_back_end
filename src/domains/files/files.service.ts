import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir } from 'fs-extra';
import { Upload } from 'graphql-upload';
import { createWriteStream, statSync } from 'fs';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { ListArgsOLD, ListArgs } from 'src/global/dto/listArgs';
import { ConfigService } from '../../configs/app.config.service';
import { getUploadConfig, IGUploadConfig } from '../../configs/upload.config';
import { IMessageType } from '../../apolloError';
import { asyncWebpConvert } from './instruments';
import {
  FilesDBModel,
  FileDBInfo,
  FileUploadInfo,
  ISaveFileParams,
  FilesGraphQLListModel,
} from './models';
import { FileListArgs } from 'src/domains/files/models/files.model.GraphQL';

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
        file._id = dbInfo._id;
      } else {
        file.isUpload = false;
        file.errorType = 'FILE_SAVE_DB_INFO_ERROR';
      }
    }

    return file;
  }

  async findAll({
    pageNumber,
    pageSize,
    find,
    sortBy,
    sortOrder,
  }: FileListArgs): Promise<FilesGraphQLListModel> {
    const findQuery = find ? { $text: { $search: '$' + find + '$' } } : {};
    const sortField = `${sortOrder > 0 ? '' : '-'}${sortBy}`;

    const count = await this.filesModel
      .aggregate()
      .match(findQuery)
      .count('count')
      .exec();

    const skip = pageNumber ? (pageNumber - 1) * pageSize : pageNumber;

    const list = await this.filesModel
      .aggregate()
      .match(findQuery)
      .sort(sortField)
      .skip(skip)
      .limit(pageSize)
      .exec();

    return {
      list,
      totalCount: count[0]?.count || 0,
    };
  }
}
