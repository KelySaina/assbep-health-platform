import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async findAll(type?: string) {
    const where: any = {};
    if (type) where.type = type;
    return this.prisma.media.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async create(data: any) {
    return this.prisma.media.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.media.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.media.delete({ where: { id } });
  }
}
