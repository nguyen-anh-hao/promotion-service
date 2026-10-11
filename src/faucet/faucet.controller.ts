import { Body, Controller, Post } from '@nestjs/common';
import { VoucherService } from '../voucher/voucher.service';
import { logger } from '../logger';

interface RedeemBody {
  account_id?: number;
  voucher_code?: string;
}

/**
 * Faucet / voucher endpoints: redeems promo codes for virtual capital or fee
 * discounts, and credits experience capital to an account.
 */
@Controller()
export class FaucetController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post('redeem-voucher')
  async redeem(@Body() body: RedeemBody) {
    const code = (body.voucher_code || '').toUpperCase();
    const result = await this.voucherService.redeem(code);
    if (result.success) {
      logger.info(
        { account_id: body.account_id, voucher_code: code, credited_amount: result.credited_amount },
        'voucher redeemed',
      );
    } else {
      logger.warn(
        { account_id: body.account_id, voucher_code: code, reason: result.reason },
        'voucher rejected',
      );
    }
    return result;
  }

  @Post('faucet')
  faucet(@Body() body: { account_id?: number; amount?: string }) {
    const amount = body.amount || '100000';
    logger.info({ account_id: body.account_id ?? 0, amount }, 'faucet credited');
    return {
      success: true,
      account_id: body.account_id ?? 0,
      credited_amount: amount,
    };
  }
}

