import { Injectable, Logger } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  constructor(private settings: SettingsService) {}

  async sendMessage(text: string) {
    const token = await this.settings.get('telegram.botToken');
    const ids = await this.settings.get('telegram.adminChatIds');
    if (!token || !ids) return;
    const raw: any[] = Array.isArray(ids) ? (ids as any[]) : [];
    const chatIds: (string | number)[] = raw
      .map((v) => (typeof v === 'number' || typeof v === 'string' ? v : null))
      .filter((v): v is string | number => v !== null);
    await Promise.all(
      chatIds.map(async (chatId) => {
        try {
          await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text }),
          });
        } catch (e) {
          this.logger.warn(`telegram send failed: ${String(e)}`);
        }
      })
    );
  }
}

