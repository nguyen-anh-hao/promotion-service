import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS } from '../redis/redis.provider';

export interface RedeemResult {
  success: boolean;
  credited_amount: string;
  reason: string;
}

// Deterministic demo fallbacks (kept for standalone runs without Redis).
const STATIC: Record<string, RedeemResult> = {
  WELCOME50: { success: true, credited_amount: '50000', reason: '' },
  FEE50: { success: true, credited_amount: '0', reason: '50% fee discount for 7 days' },
};

/**
 * Redeems voucher codes. Codes live in Redis hashes (`voucher:{code}`) so the
 * marketing team can manage them at runtime; falls back to static demo codes.
 */
@Injectable()
export class VoucherService {
  constructor(@Inject(REDIS) private readonly redis: Redis | null) {}

  async redeem(code: string): Promise<RedeemResult> {
    const key = code.toUpperCase();
    if (this.redis) {
      try {
        const v = await this.redis.hgetall(`voucher:${key}`);
        if (v && v.credited_amount !== undefined) {
          return {
            success: true,
            credited_amount: v.credited_amount,
            reason: v.reason || '',
          };
        }
      } catch {
        // fall through to the static demo codes.
      }
    }
    return (
      STATIC[key] ?? { success: false, credited_amount: '0', reason: 'invalid voucher code' }
    );
  }
}
