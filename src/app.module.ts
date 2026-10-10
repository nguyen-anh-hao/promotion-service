import { Module } from '@nestjs/common';
import { TierService } from './tiers/tier.service';
import { TierController } from './tiers/tier.controller';
import { FaucetController } from './faucet/faucet.controller';
import { redisProvider } from './redis/redis.provider';
import { LeaderboardService } from './leaderboard/leaderboard.service';
import { VoucherService } from './voucher/voucher.service';

@Module({
  imports: [],
  controllers: [TierController, FaucetController],
  providers: [TierService, LeaderboardService, VoucherService, redisProvider],
})
export class AppModule {}
