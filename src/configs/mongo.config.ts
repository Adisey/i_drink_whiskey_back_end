import { TypegooseModuleOptions } from 'nestjs-typegoose';
import { ConfigService } from './app.config.service';

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
  console.log(+new Date(), `Use mongoDB:`, mongoDB);

  return mongoDB;
};

const getMongoOptions = () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
