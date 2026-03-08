import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PhrasesService {
  constructor(private prisma: PrismaService) {}

  async findAll(language?: string, group?: string) {
    const where: any = {};
    if (language) where.language = language;
    if (group) where.group = group;
    return this.prisma.phrase.findMany({ where, orderBy: [{ group: 'asc' }, { key: 'asc' }] });
  }

  async getTranslations(language: string) {
    const phrases = await this.prisma.phrase.findMany({ where: { language } });
    const result: Record<string, string> = {};
    phrases.forEach((p) => {
      result[p.key] = p.value;
    });
    return result;
  }

  async upsert(data: { key: string; language: string; value: string; group?: string }) {
    return this.prisma.phrase.upsert({
      where: { key_language: { key: data.key, language: data.language } },
      update: { value: data.value, group: data.group },
      create: {
        key: data.key,
        language: data.language,
        value: data.value,
        group: data.group || 'general',
      },
    });
  }

  async remove(id: string) {
    return this.prisma.phrase.delete({ where: { id } });
  }
}
