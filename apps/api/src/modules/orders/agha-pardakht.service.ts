import { Injectable } from '@nestjs/common';

@Injectable()
export class AghaPardakhtService {
  private get apiKey() {
    return process.env.AGHAPARDAKHT_API_KEY || '';
  }
  private get callbackBase() {
    return process.env.PAYMENT_CALLBACK_BASE || process.env.CALLBACK_BASE || '';
  }

  createPayment(amountIRR: number, orderId: string) {
    // Placeholder: return gateway URL (replace with real API call)
    const callback = this.callbackBase || 'http://localhost:3001/api/webhooks/payment';
    const url = `${callback}?agha=1&orderId=${orderId}`;
    return { payment_url: url };
  }

  async verifyPayment(payload: any) {
    // Placeholder: trust payload in sandbox; production must verify signature
    const ok = !!payload?.orderId;
    return { ok, orderId: payload?.orderId };
  }
}
