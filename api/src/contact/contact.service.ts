import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';

const DEFAULT_CONTACT_RECIPIENT = 'kelysaina@gmail.com';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private prisma: PrismaService,
    private mailer: MailerService,
  ) {}

  async findAll() {
    return this.prisma.contactRequest.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async create(data: { name: string; email: string; subject: string; message: string }) {
    const saved = await this.prisma.contactRequest.create({ data });
    // Fire-and-forget notification: never fail the user's submission on mail errors.
    this.notify(data).catch((err) =>
      this.logger.error(`Contact mail failed: ${err?.message || err}`),
    );
    return saved;
  }

  private async resolveRecipient(): Promise<string> {
    const row = await this.prisma.siteSetting
      .findUnique({ where: { key: 'contact_email' } })
      .catch(() => null);
    return row?.value || DEFAULT_CONTACT_RECIPIENT;
  }

  private async notify(data: { name: string; email: string; subject: string; message: string }) {
    const to = await this.resolveRecipient();
    await this.mailer.send({
      from: data.email,
      to,
      subject: `[Contact] ${data.subject}`,
      message:
        `New contact request from ${data.name} <${data.email}>\n\n` +
        `Subject: ${data.subject}\n\n` +
        `${data.message}`,
    });
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
