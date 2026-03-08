import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.contactRequest.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(data: { name: string; email: string; subject: string; message: string }) {
    return this.prisma.contactRequest.create({ data });
  }

  async markRead(id: string) {
    return this.prisma.contactRequest.update({
      where: { id },
      data: { read: true },
    });
  }

  async remove(id: string) {
    return this.prisma.contactRequest.delete({ where: { id } });
  }
}
