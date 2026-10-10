import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS } from '../redis/redis.provider';

export interface LeaderboardRow {
  account_id: number;
  name: string;
  roi: string;
  volume: string;
  rank: number;
}

const MOCK: LeaderboardRow[] = [
  { account_id: 1, name: 'bot-alpha', roi: '0.12', volume: '12000000', rank: 1 },
  { account_id: 2, name: 'bot-beta', roi: '0.08', volume: '8000000', rank: 2 },
  { account_id: 3, name: 'bot-gamma', roi: '0.03', volume: '5000000', rank: 3 },
];

/**
 * Trading leaderboard backed by a Redis sorted set (`lb:volume`, score =
 * 30-day volume). Falls back to deterministic mock rows when Redis is absent.
 */
@Injectable()
export class LeaderboardService {
  constructor(@Inject(REDIS) private readonly redis: Redis | null) {}

  async getLeaderboard(limit = 10): Promise<LeaderboardRow[]> {
    if (!this.redis) {
      return MOCK;
    }
    try {
      const rows = await this.redis.zrevrange('lb:volume', 0, limit - 1, 'WITHSCORES');
      const out: LeaderboardRow[] = [];
      for (let i = 0; i < rows.length; i += 2) {
        out.push({
          account_id: Number(rows[i]),
          name: `bot-${rows[i]}`,
          roi: '0',
          volume: rows[i + 1],
          rank: out.length + 1,
        });
      }
      return out.length ? out : MOCK;
    } catch {
      return MOCK;
    }
  }

  async recordVolume(accountId: number, volume: number): Promise<void> {
    if (!this.redis) {
      return;
    }
    try {
      await this.redis.zincrby('lb:volume', volume, String(accountId));
    } catch {
      // best-effort: the leaderboard is a read model.
    }
  }
}
