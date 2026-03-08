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
      publishedAt: a.publishedAt,
      author: a.author?.name || 'ASSBEP',
      title: a.translations[0]?.title || '',
      excerpt: a.translations[0]?.excerpt || '',
      content: a.translations[0]?.content || '',
    }));
  }

  async findAllAdmin() {
    return this.prisma.article.findMany({
      include: { translations: true, author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
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
    return this.prisma.article.create({
      data: {
        slug: data.slug,
        category: data.category,
        image: data.image,
        authorId: data.authorId,
        published: data.published || false,
        publishedAt: data.published ? new Date() : null,
        translations: {
          create: data.translations || [],
        },
      },
      include: { translations: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.article.update({
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
  }

  async remove(id: string) {
    return this.prisma.article.delete({ where: { id } });
  }
}
