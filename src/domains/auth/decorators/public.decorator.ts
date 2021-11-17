import { SetMetadata } from '@nestjs/common';
import { config } from 'src/domains/auth/config';

export const Public = () => SetMetadata(config.PUBLIC_KEY, true);
