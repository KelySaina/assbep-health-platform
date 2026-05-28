import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('type') type?: string) {
    return this.mediaService.findAll(type);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('alt_text') altText?: string,
    @Body('type') type?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.mediaService.uploadFile(file, altText, type);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any) {
    return this.mediaService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.mediaService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}
