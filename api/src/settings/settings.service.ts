import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const settings = await this.prisma.siteSetting.findMany();
    const result: Record<string, string> = {};
    settings.forEach((s) => {
      result[s.key] = s.value;
    });
    return result;
  }

  async getStats() {
    // Get settings for people helped and volunteers (manual counts)
    const settings = await this.findAll();

    // Count actual data from database
    const [programsCount, partnersCount, articlesCount] = await Promise.all([
      this.prisma.program.count({ where: { published: true } }),
      this.prisma.partner.count(),
      this.prisma.article.count({ where: { published: true } }),
    ]);

    return {
      people_helped: parseInt(settings.stat_people_helped || '0', 10),
      programs_launched: programsCount,
      volunteers: parseInt(settings.stat_volunteers || '0', 10),
      partners: partnersCount,
    };
  }

  async upsert(key: string, value: string) {
    return this.prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async upsertMany(data: Record<string, string>) {
    const ops = Object.entries(data).map(([key, value]) =>
      this.prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    );
    return this.prisma.$transaction(ops);
  }
}
