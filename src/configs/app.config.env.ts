type envDefault = {
  default?: string;
  warning?: string;
  error?: string;
};

type IAPP_ENV = {
  [id: string]: envDefault;
};

export type ENV_KEY = keyof typeof APP_ENV;

export const APP_ENV: IAPP_ENV = {
  BACK_PORT: { default: '4000', warning: 'BackEnd use default port' },
  DB_DATABASE: {
    default: 'test',
    warning: 'BackEnd use default MongoDB base name',
  },
  DB_PORT: { default: '27017', warning: 'BackEnd use default MongoDB port' },
  DB_URL: { default: 'localhost', warning: 'BackEnd use default MongoDB host' },
  JWT_SECRET: { default: 'MY_SECRET', warning: 'BackEnd use default secret' },
  UPLOAD_DIR: {
    error: 'Not specified directory to upload files',
  },
};
