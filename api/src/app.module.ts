import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MediaFocalInterceptor } from './common/media-focal.interceptor';
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
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    PrismaModule,
    MailerModule,
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
  providers: [
    // Resolves image framing on every response; see common/media-focal.ts.
    { provide: APP_INTERCEPTOR, useClass: MediaFocalInterceptor },
  ],
})
export class AppModule {}
