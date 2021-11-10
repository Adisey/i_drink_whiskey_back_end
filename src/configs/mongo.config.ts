import { TypegooseModuleOptions } from 'nestjs-typegoose';
import { ConfigService } from './app.config.service';
import { Logger } from '@nestjs/common';

export const getMongoConfig = async (): Promise<TypegooseModuleOptions> => {
  return {
    uri: getMongoString(),
    ...getMongoOptions(),
  };
};

const getMongoString = () => {
  const configService = new ConfigService();
  const dbDatabase = configService.getENV('DB_DATABASE');
  const dbUrl = configService.getENV('DB_URL');
  const dbPort = configService.getENV('DB_PORT');
  const mongoDB = `mongodb://${dbUrl}:${dbPort}/${dbDatabase}`;
  Logger.log(mongoDB, 'Use mongoDB');

  return mongoDB;
};

const getMongoOptions = () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
