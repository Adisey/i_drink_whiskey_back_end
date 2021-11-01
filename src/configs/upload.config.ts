import { AppConfigService } from 'src/configs/app.config.service';

export type IGUploadConfig = {
  uploadDir: string;
};

export const getUploadConfig = async (
  appConfigService: AppConfigService,
): Promise<IGUploadConfig> => {
  return {
    uploadDir: appConfigService.getENV('UPLOAD_DIR'),
  };
};
