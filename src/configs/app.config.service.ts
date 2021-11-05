import { Logger } from '@nestjs/common';
import { ConfigService as MainConfigService } from '@nestjs/config';

import { APP_ENV, ENV_KEY } from './app.config.env';
import { ShutdownService } from '../shutdown/shutdown.service';

export class ConfigService extends MainConfigService {
  // ToDo: 02.11.2021 - I want to use global ShutdownService. Neet do it
  private readonly shutdownService: ShutdownService;
  constructor() {
    super();
    this.shutdownService = new ShutdownService();
  }

  shutdownTry(message: string) {
    Logger.error(message, 'Shutdown');
    Logger.warn('Server Down after 5 sec', 'Shutdown');
    setTimeout(() => {
      Logger.warn('Server Start Down', 'Shutdown');
      this.shutdownService.down();
    }, 5000);
  }

  getENV(key: ENV_KEY): string {
    const value = this.get<string>(key as string);
    const message = APP_ENV[key].error
      ? `${APP_ENV[key].error}: ${key}`
      : APP_ENV[key].warning
      ? `${APP_ENV[key].warning}: ${key}`
      : `Value ${key} not found!`;
    if (value) {
      return value;
    } else if (APP_ENV[key].error) {
      Logger.error(message, 'ENV');
      this.shutdownTry(message);
    } else if (APP_ENV[key].warning) {
      Logger.warn(message, 'ENV');
    }

    if (!value && APP_ENV[key].default) {
      return APP_ENV[key].default;
    } else {
      this.shutdownTry(message);
    }
  }
}
