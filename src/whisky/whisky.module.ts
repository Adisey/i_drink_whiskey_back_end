import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DateScalar } from '../common/scalars/date.scalar';
import { WhiskyResolver } from './whisky.resolver';
import { WhiskyService } from './whisky.service';
import { WhiskySchema } from './models/whisky.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Whisky', schema: WhiskySchema }]),
  ],
  providers: [WhiskyResolver, WhiskyService, DateScalar],
})
export class WhiskyModule {}
