import { Injectable, Logger } from '@nestjs/common';

const MAILER_ENDPOINT = 'https://ks-mailer.vercel.app/api/send';

export interface MailPayload {
  from: string;
  to: string;
  subject: string;
  message: string;
}

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  /**
   * Sends an email through the external ks-mailer service.
   * SMTP credentials live in the hosted mailer, so no env config is needed here.
   * Throws on failure; callers may swallow the error if delivery is non-critical.
   */
  async send(payload: MailPayload): Promise<{ messageId?: string }> {
    const res = await fetch(MAILER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    let json: any = null;
    try {
      json = await res.json();
    } catch {
      // ignore parse error
    }

    if (!res.ok || (json && json.isOK === false)) {
      const detail =
        (json && (json.error || (json.details && json.details.join(', ')))) ||
        `HTTP ${res.status}`;
      this.logger.error(`Mailer failed (${payload.to}): ${detail}`);
      throw new Error(`Mailer failed: ${detail}`);
    }

    this.logger.log(`Email sent to ${payload.to} (id=${json?.messageId ?? 'n/a'})`);
    return { messageId: json?.messageId };
  }

  /** Convenience helper that never throws — logs and swallows errors. */
  async sendSafe(payload: MailPayload): Promise<void> {
    try {
      await this.send(payload);
    } catch (err: any) {
      this.logger.warn(`sendSafe swallowed error: ${err?.message || err}`);
    }
  }
}
