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
    const programs = await this.prisma.program.findMany({
      include: { translations: true },
      orderBy: { order: 'asc' },
    });

    // Flatten translations for admin UI
    return programs.map(p => {
      const enTranslation = p.translations.find(t => t.language === 'en') || p.translations[0];

      return {
        id: p.id,
        slug: p.slug,
        category: p.category,
        image: p.image,
        order: p.order,
        published: p.published,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        title: enTranslation?.title || '',
        description: enTranslation?.description || '',
        content: enTranslation?.content || '',
      };
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
    // Generate slug from title if not provided
    const slug = data.slug || this.generateSlug(data.title || 'program');

    // Support both flat format (title, description) and translations array
    const translations = data.translations || [];
    if (data.title && translations.length === 0) {
      translations.push({
        language: 'en',
        title: data.title,
        description: data.description || '',
        content: data.content || '',
      });
    }

    return this.prisma.program.create({
      data: {
        slug,
        category: data.category,
        image: data.image,
        order: data.order || 0,
        published: data.published || false,
        translations: {
          create: translations,
        },
      },
      include: { translations: true },
    });
  }

  async update(id: string, data: any) {
    // Update the program fields
    const updated = await this.prisma.program.update({
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

    // If flat title/description provided, upsert the English translation
    if (data.title !== undefined) {
      const existingEn = updated.translations.find(t => t.language === 'en');
      if (existingEn) {
        await this.prisma.programTranslation.update({
          where: { id: existingEn.id },
          data: {
            title: data.title,
            description: data.description || existingEn.description,
            content: data.content || existingEn.content,
          },
        });
      } else {
        await this.prisma.programTranslation.create({
          data: {
            programId: id,
            language: 'en',
            title: data.title,
            description: data.description || '',
            content: data.content || '',
          },
        });
      }
    }

    return this.prisma.program.findUnique({
      where: { id },
      include: { translations: true },
    });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now().toString(36);
  }

  async remove(id: string) {
    return this.prisma.program.delete({ where: { id } });
  }
}
