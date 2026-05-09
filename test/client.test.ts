import assert from "node:assert/strict";
import test from "node:test";
import { GenukaClient } from "@/index";

test("payins.create sends signed headers and stable JSON body", async () => {
  const calls: Array<{ url: string; init: RequestInit }> = [];

  const fetcher: typeof fetch = async (url, init) => {
    calls.push({ url: String(url), init: init ?? {} });

    return new Response(JSON.stringify({ data: { id: "payin_1" } }), {
      status: 202,
      headers: { "Content-Type": "application/json" },
    });
  };

  const client = new GenukaClient({
    baseUrl: "https://api.genuka.com/",
    publicKey: "pk_test_public",
    secretKey: "sk_test_secret",
    fetch: fetcher,
  });

  await client.payins.create(
    {
      amount: 200,
      currency: "XAF",
      payer_phone: "+237694010263",
      operator_code: "ORANGE_MONEY",
    },
    { idempotencyKey: "order-1" },
  );

  assert.equal(calls.length, 1);
  assert.equal(calls[0]?.url, "https://api.genuka.com/api/v1/payments");
  assert.equal(calls[0]?.init.method, "POST");
  assert.equal(
    calls[0]?.init.body,
    '{"amount":200,"currency":"XAF","payer_phone":"+237694010263","operator_code":"ORANGE_MONEY"}',
  );

  const headers = calls[0]?.init.headers as Record<string, string>;

  assert.equal(headers["X-Public-Key"], "pk_test_public");
  assert.equal(headers["Idempotency-Key"], "order-1");
  assert.match(headers["X-Timestamp"] ?? "", /^[0-9]+$/);
  assert.match(headers["X-Signature"] ?? "", /^[a-f0-9]{64}$/);
});

test("payins.list signs query string path", async () => {
  const calls: Array<{ url: string; init: RequestInit }> = [];

  const fetcher: typeof fetch = async (url, init) => {
    calls.push({ url: String(url), init: init ?? {} });

    return new Response(JSON.stringify({ data: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  const client = new GenukaClient({
    baseUrl: "https://api.genuka.com",
    publicKey: "pk_test_public",
    secretKey: "sk_test_secret",
    fetch: fetcher,
  });

  await client.payins.list({
    per_page: 20,
    filter: { status: "SUCCESS" },
    sort: "-created_at",
  });

  assert.equal(
    calls[0]?.url,
    "https://api.genuka.com/api/v1/payments?per_page=20&sort=-created_at&filter%5Bstatus%5D=SUCCESS",
  );
  assert.equal(calls[0]?.init.method, "GET");
  assert.equal(calls[0]?.init.body, undefined);
});

test("client uses staging API base URL by default", async () => {
  const calls: Array<{ url: string; init: RequestInit }> = [];

  const fetcher: typeof fetch = async (url, init) => {
    calls.push({ url: String(url), init: init ?? {} });

    return new Response(JSON.stringify({ data: [] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  const client = new GenukaClient({
    publicKey: "pk_test_public",
    secretKey: "sk_test_secret",
    fetch: fetcher,
  });

  await client.payins.list();

  assert.equal(calls[0]?.url, "https://staging-api-pay.genuka.com/api/v1/payments");
});
