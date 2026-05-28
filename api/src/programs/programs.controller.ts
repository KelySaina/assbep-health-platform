import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('programs')
export class ProgramsController {
  constructor(private programsService: ProgramsService) {}

  @Get()
  findAll(@Query('lang') lang?: string) {
    return this.programsService.findAll(lang);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  findAllAdmin() {
    return this.programsService.findAllAdmin();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string, @Query('lang') lang?: string) {
    return this.programsService.findOne(slug, lang);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any) {
    return this.programsService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.programsService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.programsService.remove(id);
  }
}
