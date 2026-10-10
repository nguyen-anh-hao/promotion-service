# Promotion Service (`promotion-service`)

> **Event-Driven Rewards, Fee Discount Vouchers & Gamification Engine** built with Node.js & TypeScript.

---

## 1. Primary Responsibility
The Promotion Service manages user incentives without impacting the critical trading path:
- Calculates fee discounts based on user tier or active voucher codes.
- Tracks user trading volume quests and issues cashback rewards.
- Provides eventual consistency: promotions never block order matching.

---

## 2. Boundaries & I/O
- **Ingress:** Called by `api-gateway` (`/promotions/apply`, `/promotions/vouchers`).
- **Events (Target):** Subscribes to `TradeExecuted` events to accumulate quest progress.
- **Tracing:** OpenTelemetry distributed tracing enabled via `tracing.js`.

---

## 3. Quick Start (Run in 2 minutes)

```bash
npm install
npm run build
npm start
```

---

## 4. Engineering Roadmap (Event-Driven Stream Processing)

| Version | Phase | Optimization Target & Stream Processing Problem |
| :--- | :--- | :--- |
| **v1.0.0** *(Current)* | **Baseline REST Service** | Express/TypeScript HTTP endpoints for voucher validation and discount calculation. |
| **v1.1.0** | **Asynchronous Event Ingestion** | Consume trade execution streams from Kafka via `kafkajs`. Idempotent quest progress updates using Redis HyperLogLog / Bitmaps. |
| **v1.2.0** | **High-Performance Voucher Rules Engine** | Implement compiled rule trees (using RETE algorithm or WASM-based rule evaluator) to evaluate complex tiered discount conditions in under 100 microseconds. |
| **v2.0.0** | **Real-Time Streaming State Machine** | Transition to stateful stream processing (Flink or Redis Streams state machine) to power real-time trading leaderboards and zero-latency flash rewards. |

