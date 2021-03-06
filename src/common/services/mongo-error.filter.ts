import {
  BadRequestException,
  Catch,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoErrorFilter implements ExceptionFilter {
  catch(exception: MongoError) {
    Logger.error(exception.message, exception.code, 'MongoErrorFilter');
    return new BadRequestException({
      code: exception.code,
      msg: exception.message,
    });
  }
}
