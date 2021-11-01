import { ConfigService } from 'src/configs/app.config.service';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJWTConfig = async (): Promise<JwtModuleOptions> => {
  const configService = new ConfigService();
  return {
    secret: configService.getENV('JWT_SECRET'),
  };
};

export const nbfToken = (): number => {
  return Math.round(+new Date() / 1000);
};

export const expAccessToken = (): number => {
  return Math.round((+new Date() + 7 * 24 * 60 * 60 * 1000) / 1000);
};
