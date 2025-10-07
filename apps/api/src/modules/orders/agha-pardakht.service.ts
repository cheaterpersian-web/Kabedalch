import { Injectable } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class AghaPardakhtService {
  constructor(private settings: SettingsService) {}

  private async getSetting(key: string): Promise<string> {
    const val = await this.settings.get(key);
    if (typeof val === 'string') return val;
    if (val == null) return '';
    try {
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  }

  private async getApiKey(): Promise<string> {
    const fromDb = await this.getSetting('payments.agha.apiKey');
    return fromDb || process.env.AGHAPARDAKHT_API_KEY || '';
  }

  private async getCallbackBase(): Promise<string> {
    const fromDb = await this.getSetting('payments.callbackBase');
    return fromDb || process.env.PAYMENT_CALLBACK_BASE || process.env.CALLBACK_BASE || '';
  }

  async createPayment(amountIRR: number, orderId: string) {
    // TODO: call real AghaPardakht API using await this.getApiKey()
    const callback = (await this.getCallbackBase()) || 'http://localhost:3001/api/webhooks/payment';
    const url = `${callback}?agha=1&orderId=${orderId}`;
    return { payment_url: url };
  }

  async verifyPayment(payload: any) {
    // TODO: verify signature with await this.getApiKey() when docs available
    const ok = !!payload?.orderId;
    return { ok, orderId: payload?.orderId };
  }
}
