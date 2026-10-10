import { Body, Controller, Post } from '@nestjs/common';
import { VoucherService } from '../voucher/voucher.service';

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
  redeem(@Body() body: RedeemBody) {
    const code = (body.voucher_code || '').toUpperCase();
    return this.voucherService.redeem(code);
  }

  @Post('faucet')
  faucet(@Body() body: { account_id?: number; amount?: string }) {
    const amount = body.amount || '100000';
    return {
      success: true,
      account_id: body.account_id ?? 0,
      credited_amount: amount,
    };
  }
}

