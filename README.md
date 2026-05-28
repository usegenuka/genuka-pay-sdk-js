# Genuka Pay TypeScript SDK

Server-side TypeScript SDK for the Genuka Pay API.

Do not use this SDK in browser code. It signs requests with your application `secretKey`.

## Install

```bash
pnpm add @genuka/pay-sdk
```

## Usage

```ts
import { GenukaClient } from "@genuka/pay-sdk";

const genuka = new GenukaClient({
  publicKey: process.env.GENUKA_PUBLIC_KEY!,
  secretKey: process.env.GENUKA_SECRET_KEY!,
});

const payin = await genuka.payins.create({
  amount: 2000,
  currency: "XAF",
  payer_phone: "+237694010263",
  operator_code: "ORANGE_MONEY",
  metadata: {
    order_id: "ORD-1001",
  },
});
```

By default, the SDK targets `https://api-pay.genuka.com`. Pass `baseUrl` to use another environment.

## Authentication

The SDK signs every request with:

```text
timestamp + HTTP_METHOD + path_with_query + raw_body
```

Headers sent:

```http
X-Public-Key: pk_live_xxx
X-Timestamp: 1778353137
X-Signature: hmac_sha256_hex
Content-Type: application/json
```

Phone numbers must be international E.164 style, for example `+237694010263`, `+241...`, `+235...`.

## API

```ts
await genuka.payins.create(payload, { idempotencyKey: "order-1001" });
await genuka.payins.list({ per_page: 20 });
await genuka.payins.checkStatus("track-xxx");

await genuka.payouts.create(payload, { idempotencyKey: "payout-1001" });
await genuka.payouts.list({ per_page: 20 });
await genuka.payouts.get("payout-id");
await genuka.payouts.cancel("payout-id");

await genuka.checkout.create(payload);
await genuka.checkout.get("checkout-token");
```

## Development

```bash
pnpm install
pnpm test
pnpm build
```
