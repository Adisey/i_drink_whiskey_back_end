import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJWTConfig = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => {
  return {
    secret: configService.get('JWT_SECRET'),
  };
};

export const expToken = (): number => {
  return +new Date() + 7 * 24 * 60 * 60 * 1000;
};
