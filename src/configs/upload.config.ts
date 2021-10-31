import { ConfigService } from '@nestjs/config';
import { AppConfigService } from 'src/configs/app.config.service';

export const UPLOAD_DIR_KEY = 'UPLOAD_DIR';

export type IGUploadConfig = {
  uploadDir: string;
};

export const getUploadConfig = async (
  configService: ConfigService,
): Promise<IGUploadConfig> => {
  return {
    uploadDir: configService.get<string>(UPLOAD_DIR_KEY, { infer: true }),
  };
};

export const getUploadConfig2 = async (
  appConfigService: AppConfigService,
): Promise<IGUploadConfig> => {
  const value = appConfigService.getENV('UPLOAD_DIR');
  console.log(
    +new Date(),
    '-(getUploadConfig2)->',
    typeof value,
    `-value->`,
    value,
  );
  return {
    uploadDir: value,
  };
};
