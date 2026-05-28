import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('resources')
export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {}

  @Get()
  findAll(
    @Query('lang') lang?: string,
    @Query('language') language?: string,
    @Query('type') type?: string,
  ) {
    return this.resourcesService.findAll(lang || language, type);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  findAllAdmin() {
    return this.resourcesService.findAllAdmin();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any) {
    return this.resourcesService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.resourcesService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourcesService.remove(id);
  }
}
