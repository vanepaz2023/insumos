import { Controller, Get, Post, Body, Patch, Param,
   Delete, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {Response} from 'express'
import { FileService } from './file.service';
import { fileFilter ,fileNamer } from './helpers';
import { ConfigService } from '@nestjs/config';


@ApiTags('Files- Get and Upload')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService,
    private readonly configService: ConfigService
    ) { }

@Get('product/:imageName')
findProductImage(
  @Res() res: Response,
  @Param('imageName') imageName: string
){

  const path = this.fileService.getStaticProductImage(imageName);
  console.log("path", path);
  
res.sendFile(path)
}
  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer

    })
  }))

  uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Make sure thata the file is an image')

    }
    const secureUrl =`${this.configService.get('HOST_API')}/files/product/${ file.filename}`;
    return { secureUrl}
  }

}
