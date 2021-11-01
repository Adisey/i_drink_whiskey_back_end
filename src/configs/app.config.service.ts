import { ConfigService as MainConfigService } from '@nestjs/config';

export class ConfigService extends MainConfigService {
  constructor() {
    super();
  }

  getENV(key: ENV_KEY): string {
    console.log(+new Date(), '-(getENV)->', typeof key, `-key->`, key);
    const value = this.get<string>(key as string);

    const message = APP_ENV[key].error
      ? `${APP_ENV[key].error}: ${key}`
      : APP_ENV[key].warning
      ? `${APP_ENV[key].warning}: ${key}`
      : `Value ${key} not found!`;
    console.log(
      +new Date(),
      '-(getENV)->',
      typeof message,
      `-message->`,
      message,
    );
    if (value) {
      console.log(
        +new Date(),
        '-(getENV)-Found Value->',
        `-key->`,
        key,
        typeof value,
        `-value->`,
        value,
      );
      return value;
    } else if (APP_ENV[key].error) {
      console.log(
        +new Date(),
        '-(getENV)-Found ERROR->',
        `-key->`,
        key,
        typeof value,
        `-value->`,
        value,
      );

      console.error(message);
      throw new Error(message);
    } else if (APP_ENV[key].warning) {
      console.log(
        +new Date(),
        '-(getENV)-Found MESSAGE->',
        `-key->`,
        key,
        typeof value,
        `-value->`,
        value,
      );
      console.warn(message);
    }

    if (!value && APP_ENV[key].default) {
      console.log(
        +new Date(),
        '-(getENV)-Found Default->',
        `-key->`,
        key,
        typeof value,
        `-value->`,
        value,
      );
      return APP_ENV[key].default;
    } else {
      console.log(
        +new Date(),
        '-(getENV)-NOT Found & NOT Default->',
        `-key->`,
        key,
        typeof value,
        `-value->`,
        value,
      );

      throw new Error(message);
    }
  }
}

// @Injectable()
// export class ConfigService extends AppConfigService {}

type envDefault = {
  default?: string;
  warning?: string;
  error?: string;
};

type IAPP_ENV = {
  [id: string]: envDefault;
};

type ENV_KEY = keyof typeof APP_ENV;

const APP_ENV: IAPP_ENV = {
  BACK_PORT: { default: '4000', warning: 'BackEnd use default port' },
  DB_DATABASE: { default: 'test', warning: 'BackEnd use default DB name' },
  DB_URL: { default: 'DB', warning: 'BackEnd use default DB host' },
  DB_PORT: { default: '27017', warning: 'BackEnd use default DB port' },
  JWT_SECRET: { default: 'MY_SECRET', warning: 'BackEnd use default secret' },
  UPLOAD_DIR: {
    error: 'Not specified directory to upload files',
  },
};
