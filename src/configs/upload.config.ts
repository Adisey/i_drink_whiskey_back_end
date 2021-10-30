import { ConfigService } from '@nestjs/config';

export const UPLOAD_DIR_KEY = 'UPLOAD_DIR';

export type IGUploadConfig = {
  uploadDir: string;
};

export const getUploadConfig = async (
  configService: ConfigService,
): Promise<IGUploadConfig> => {
  return {
    uploadDir: configService.get(UPLOAD_DIR_KEY),
  };
};
