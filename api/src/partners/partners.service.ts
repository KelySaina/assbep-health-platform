import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.partner.findMany({ orderBy: { order: 'asc' } });
  }

  async create(data: any) {
    return this.prisma.partner.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.partner.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.partner.delete({ where: { id } });
  }
}
