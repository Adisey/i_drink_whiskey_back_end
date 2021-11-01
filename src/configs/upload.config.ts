import { ConfigService } from 'src/configs/app.config.service';

export type IGUploadConfig = {
  uploadDir: string;
};

export const getUploadConfig = async (
  configService: ConfigService,
): Promise<IGUploadConfig> => {
  return {
    uploadDir: configService.getENV('UPLOAD_DIR'),
  };
};
