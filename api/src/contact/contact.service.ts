import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailerService } from '../mailer/mailer.service';


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

  // The recipient is whatever the site is configured to show as its contact
  // address — the `contact_email` setting, the same value the public page reads.
  // There is deliberately no baked-in fallback: a message must go to the address
  // the site currently advertises or to nowhere, never to a stale hardcoded inbox.
  private async resolveRecipient(): Promise<string | null> {
    const row = await this.prisma.siteSetting
      .findUnique({ where: { key: 'contact_email' } })
      .catch(() => null);
    const value = (row?.value || '').trim();
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value) ? value : null;
  }

  private buildHtml(data: { name: string; email: string; subject: string; message: string }): string {
    const safe = (s: string) =>
      String(s ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    return `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
  <div style="background:linear-gradient(135deg,#0ea5e9,#0369a1);padding:24px 28px">
    <h1 style="margin:0;color:#fff;font-size:14px;font-weight:600;letter-spacing:1px;text-transform:uppercase">ASSBEP — New contact request</h1>
    <p style="margin:6px 0 0;color:#e0f2fe;font-size:13px">${safe(data.subject)}</p>
  </div>
  <div style="padding:24px 28px">
    <p style="color:#0f172a;font-size:15px;line-height:1.7;margin:0;white-space:pre-wrap">${safe(data.message)}</p>
  </div>
  <div style="padding:18px 28px;background:#f8fafc;border-top:1px solid #e5e7eb">
    <p style="margin:0 0 4px;color:#0f172a;font-size:13px"><strong>${safe(data.name)}</strong></p>
    <p style="margin:0;color:#0369a1;font-size:13px"><a href="mailto:${safe(data.email)}" style="color:#0369a1;text-decoration:none">${safe(data.email)}</a></p>
  </div>
</div>`;
  }

  private async notify(data: { name: string; email: string; subject: string; message: string }) {
    const to = await this.resolveRecipient();
    if (!to) {
      // The submission is already saved; it is visible in the admin contact list.
      this.logger.warn(
        'No valid contact_email configured — contact request saved but no email sent. ' +
          'Set it in admin → Settings.',
      );
      return;
    }
    await this.mailer.send({
      from: data.email,
      to,
      subject: `[ASSBEP] ${data.subject} — ${data.name}`,
      message: this.buildHtml(data),
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
