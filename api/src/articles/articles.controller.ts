import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Get()
  findAll(@Query('lang') lang?: string, @Query('category') category?: string) {
    return this.articlesService.findAll(lang, category);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  findAllAdmin() {
    return this.articlesService.findAllAdmin();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string, @Query('lang') lang?: string) {
    return this.articlesService.findOne(slug, lang);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any) {
    return this.articlesService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.articlesService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articlesService.remove(id);
  }
}
