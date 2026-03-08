import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PhrasesService } from './phrases.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('phrases')
export class PhrasesController {
  constructor(private phrasesService: PhrasesService) {}

  @Get()
  findAll(@Query('lang') lang?: string, @Query('group') group?: string) {
    return this.phrasesService.findAll(lang, group);
  }

  @Get('translations/:lang')
  getTranslations(@Param('lang') lang: string) {
    return this.phrasesService.getTranslations(lang);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  upsert(@Body() body: { key: string; language: string; value: string; group?: string }) {
    return this.phrasesService.upsert(body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phrasesService.remove(id);
  }
}
