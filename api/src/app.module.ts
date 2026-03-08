import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProgramsModule } from './programs/programs.module';
import { ArticlesModule } from './articles/articles.module';
import { ResourcesModule } from './resources/resources.module';
import { PartnersModule } from './partners/partners.module';
import { PhrasesModule } from './phrases/phrases.module';
import { MediaModule } from './media/media.module';
import { ContactModule } from './contact/contact.module';
import { SettingsModule } from './settings/settings.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProgramsModule,
    ArticlesModule,
    ResourcesModule,
    PartnersModule,
    PhrasesModule,
    MediaModule,
    ContactModule,
    SettingsModule,
    UsersModule,
  ],
})
export class AppModule {}
