import { ConfigService } from 'src/configs/app.config.service';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = async (
  configService: ConfigService,
): Promise<TypegooseModuleOptions> => {
  return {
    uri: getMongoString(configService),
    ...getMongoOptions(),
  };
};

const getMongoString = (configService: ConfigService) => {
  const dbDatabase = configService.get('DB_DATABASE') || 'test';
  const dbUrl = configService.get('DB_URL') || 'localhost';
  const dbPort = configService.get('DB_PORT') || '27017';
  const mongoDB = `mongodb://${dbUrl}:${dbPort}/${dbDatabase}`;
  console.log(+new Date(), `Use mongoDB:`, mongoDB);

  return mongoDB;
};

const getMongoOptions = () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
