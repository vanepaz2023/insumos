import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [FileController],
  providers: [FileService],
  imports: [ConfigModule ]

})
export class FileModule {}
