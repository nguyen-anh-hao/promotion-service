import { Injectable } from '@nestjs/common';

export interface FeeTier {
  volume_30d: string;
  current_tier: string;
  maker_fee: string;
  taker_fee: string;
}

/**
 * Computes VIP fee tiers from 30-day rolling volume. In production the volume
 * is read from the settlement service; here it is derived from the account id
 * so the demo returns deterministic tiers.
 */
@Injectable()
export class TierService {
  getFeeTiers(accountId: number): FeeTier {
    const volume = accountId * 100000;
    let currentTier = 'VIP0';
    let makerFee = '0.0008';
    let takerFee = '0.001';
    if (volume > 10000000) {
      currentTier = 'VIP2';
      // VIP2 makers receive a rebate (negative fee) to incentivize liquidity.
      makerFee = '-0.0001';
      takerFee = '0.0006';
    } else if (volume > 1000000) {
      currentTier = 'VIP1';
      makerFee = '0.0004';
      takerFee = '0.0008';
    }
    return {
      volume_30d: volume.toString(),
      current_tier: currentTier,
      maker_fee: makerFee,
      taker_fee: takerFee,
    };
  }
}
