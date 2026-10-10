import { Controller, Get, Query } from '@nestjs/common';
import { TierService } from './tier.service';
import { LeaderboardService } from '../leaderboard/leaderboard.service';

@Controller()
export class TierController {
  constructor(
    private readonly tierService: TierService,
    private readonly leaderboardService: LeaderboardService,
  ) {}

  @Get('fee-tiers')
  feeTiers(@Query('account_id') accountId: string) {
    const id = parseInt(accountId || '1', 10);
    return this.tierService.getFeeTiers(Number.isNaN(id) ? 1 : id);
  }

  @Get('leaderboard')
  async leaderboard() {
    return this.leaderboardService.getLeaderboard();
  }
}

