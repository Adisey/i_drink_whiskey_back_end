import { ConfigService } from 'src/configs/app.config.service';
import { JwtModuleOptions } from '@nestjs/jwt';

export const JWT_KEY = 'JWT_SECRET';

export const getJWTConfig = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => {
  return {
    secret: configService.get(JWT_KEY),
  };
};

export const nbfToken = (): number => {
  return Math.round(+new Date() / 1000);
};

export const expAccessToken = (): number => {
  return Math.round((+new Date() + 7 * 24 * 60 * 60 * 1000) / 1000);
};
