import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  async findAll(language?: string) {
    const programs = await this.prisma.program.findMany({
      where: { published: true },
      include: {
        translations: language ? { where: { language } } : true,
      },
      orderBy: { order: 'asc' },
    });
    return programs.map((p) => ({
      id: p.id,
      slug: p.slug,
      category: p.category,
      image: p.image,
      order: p.order,
      published: p.published,
      title: p.translations[0]?.title || '',
      description: p.translations[0]?.description || '',
      content: p.translations[0]?.content || '',
    }));
  }

  async findAllAdmin() {
    return this.prisma.program.findMany({
      include: { translations: true },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(slug: string, language?: string) {
    const program = await this.prisma.program.findUnique({
      where: { slug },
      include: {
        translations: language ? { where: { language } } : true,
      },
    });
    if (!program) return null;
    return {
      id: program.id,
      slug: program.slug,
      category: program.category,
      image: program.image,
      order: program.order,
      published: program.published,
      title: program.translations[0]?.title || '',
      description: program.translations[0]?.description || '',
      content: program.translations[0]?.content || '',
      translations: program.translations,
    };
  }

  async create(data: any) {
    return this.prisma.program.create({
      data: {
        slug: data.slug,
        category: data.category,
        image: data.image,
        order: data.order || 0,
        published: data.published || false,
        translations: {
          create: data.translations || [],
        },
      },
      include: { translations: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.program.update({
      where: { id },
      data: {
        slug: data.slug,
        category: data.category,
        image: data.image,
        order: data.order,
        published: data.published,
      },
      include: { translations: true },
    });
  }

  async remove(id: string) {
    return this.prisma.program.delete({ where: { id } });
  }
}
