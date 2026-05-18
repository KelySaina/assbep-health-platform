import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async findAll(language?: string, category?: string) {
    const where: any = { published: true };
    if (category) where.category = category;

    const articles = await this.prisma.article.findMany({
      where,
      include: {
        translations: language ? { where: { language } } : true,
        author: { select: { name: true } },
      },
      orderBy: { publishedAt: 'desc' },
    });
    return articles.map((a) => ({
      id: a.id,
      slug: a.slug,
      category: a.category,
      image: a.image,
      featured_image: a.image,
      publishedAt: a.publishedAt,
      published_at: a.publishedAt,
      author: a.author?.name || 'ASSBEP',
      title: a.translations[0]?.title || '',
      excerpt: a.translations[0]?.excerpt || '',
      content: a.translations[0]?.content || '',
    }));
  }

  async findAllAdmin() {
    const articles = await this.prisma.article.findMany({
      include: { translations: true, author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });

    // Flatten translations for admin UI
    return articles.map(a => {
      const enTranslation = a.translations.find(t => t.language === 'en') || a.translations[0];

      return {
        id: a.id,
        slug: a.slug,
        category: a.category,
        image: a.image,
        published: a.published,
        publishedAt: a.publishedAt,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        author: a.author?.name || 'ASSBEP',
        title: enTranslation?.title || '',
        excerpt: enTranslation?.excerpt || '',
        content: enTranslation?.content || '',
      };
    });
  }

  async findOne(slug: string, language?: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        translations: language ? { where: { language } } : true,
        author: { select: { name: true } },
      },
    });
    if (!article) return null;
    return {
      ...article,
      title: article.translations[0]?.title || '',
      excerpt: article.translations[0]?.excerpt || '',
      content: article.translations[0]?.content || '',
      author: article.author?.name || 'ASSBEP',
    };
  }

  async create(data: any) {
    const slug = data.slug || this.generateSlug(data.title || 'article');

    const translations = data.translations || [];
    if (data.title && translations.length === 0) {
      translations.push({
        language: 'en',
        title: data.title,
        excerpt: data.excerpt || '',
        content: data.content || '',
      });
    }

    return this.prisma.article.create({
      data: {
        slug,
        category: data.category,
        image: data.image,
        authorId: data.authorId,
        published: true,
        publishedAt: new Date(),
        translations: {
          create: translations,
        },
      },
      include: { translations: true },
    });
  }

  async update(id: string, data: any) {
    const updated = await this.prisma.article.update({
      where: { id },
      data: {
        slug: data.slug,
        category: data.category,
        image: data.image,
        published: data.published,
        publishedAt: data.published ? new Date() : null,
      },
      include: { translations: true },
    });

    if (data.title !== undefined) {
      const existingEn = updated.translations.find(t => t.language === 'en');
      if (existingEn) {
        await this.prisma.articleTranslation.update({
          where: { id: existingEn.id },
          data: {
            title: data.title,
            excerpt: data.excerpt || existingEn.excerpt,
            content: data.content || existingEn.content,
          },
        });
      } else {
        await this.prisma.articleTranslation.create({
          data: {
            articleId: id,
            language: 'en',
            title: data.title,
            excerpt: data.excerpt || '',
            content: data.content || '',
          },
        });
      }
    }

    return this.prisma.article.findUnique({
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
    return this.prisma.article.delete({ where: { id } });
  }
}
