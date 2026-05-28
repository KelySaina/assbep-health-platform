import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  create(@Body() body: { name: string; email: string; subject: string; message: string }) {
    return this.contactService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/read')
  markRead(@Param('id') id: string) {
    return this.contactService.markRead(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
