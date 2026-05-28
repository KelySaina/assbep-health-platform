import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('partners')
export class PartnersController {
  constructor(private partnersService: PartnersService) {}

  @Get()
  findAll() {
    return this.partnersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any) {
    return this.partnersService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.partnersService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnersService.remove(id);
  }
}
