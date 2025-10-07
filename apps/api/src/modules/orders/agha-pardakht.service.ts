import { Injectable } from '@nestjs/common';

@Injectable()
export class AghaPardakhtService {
  private get apiKey() {
    const key = process.env.AGHAPARDAKHT_API_KEY;
    if (!key) throw new Error('AGHAPARDAKHT_API_KEY missing');
    return key;
  }

  createPayment(amountIRR: number, orderId: string) {
    // Placeholder: return gateway URL (replace with real API call)
    const callback = process.env.PAYMENT_CALLBACK_BASE || 'http://localhost:3001/api/webhooks/payment';
    const url = `${callback}?agha=1&orderId=${orderId}`;
    return { payment_url: url };
  }

  async verifyPayment(payload: any) {
    // Placeholder: trust payload in sandbox; production must verify signature
    const ok = !!payload?.orderId;
    return { ok, orderId: payload?.orderId };
  }
}
