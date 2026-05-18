import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResourcesService {
  constructor(private prisma: PrismaService) {}

  async findAll(language?: string, type?: string) {
    const where: any = { published: true };
    if (type) where.type = type;

    const resources = await this.prisma.resource.findMany({
      where,
      include: {
        translations: language ? { where: { language } } : true,
      },
      orderBy: { order: 'asc' },
    });

    return resources.map((r) => {
      const translation = r.translations[0];
      // Map type to category (guides, videos, documents)
      const category = r.type === 'guide' ? 'guides' : r.type === 'video' ? 'videos' : 'documents';

      return {
        id: r.id,
        type: r.type,
        category,
        file: r.fileUrl,
        fileUrl: r.fileUrl,
        language: translation?.language || 'en',
        title: translation?.title || '',
        description: translation?.description || '',
      };
    });
  }

  async findAllAdmin() {
    const resources = await this.prisma.resource.findMany({
      include: { translations: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return resources.map((resource) => {
      const enTranslation = resource.translations.find((t) => t.language === 'en') || resource.translations[0];

      return {
        id: resource.id,
        type: resource.type,
        fileUrl: resource.fileUrl,
        published: resource.published,
        order: resource.order,
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt,
        title: enTranslation?.title || '',
        description: enTranslation?.description || '',
      };
    });
  }

  async create(data: any) {
    const translations = data.translations || [];
    if (data.title && translations.length === 0) {
      translations.push({
        language: 'en',
        title: data.title,
        description: data.description || '',
      });
    }

    return this.prisma.resource.create({
      data: {
        type: data.type,
        fileUrl: data.fileUrl,
        published: data.published || false,
        order: data.order || 0,
        translations: { create: translations },
      },
      include: { translations: true },
    });
  }

  async update(id: string, data: any) {
    // Build translations array from flat or structured data
    const translations = Array.isArray(data.translations) ? data.translations : [];
    if (data.title && translations.length === 0) {
      translations.push({
        language: 'en',
        title: data.title,
        description: data.description || '',
      });
    }

    return this.prisma.resource.update({
      where: { id },
      data: {
        type: data.type,
        fileUrl: data.fileUrl,
        published: data.published,
        order: data.order,
        translations: translations.length
          ? {
              upsert: translations.map((translation: { language: string; title: string; description: string }) => ({
                where: {
                  resourceId_language: {
                    resourceId: id,
                    language: translation.language,
                  },
                },
                update: {
                  title: translation.title,
                  description: translation.description,
                },
                create: {
                  language: translation.language,
                  title: translation.title,
                  description: translation.description,
                },
              })),
            }
          : undefined,
      },
      include: { translations: true },
    });
  }

  async remove(id: string) {
    return this.prisma.resource.delete({ where: { id } });
  }
}
