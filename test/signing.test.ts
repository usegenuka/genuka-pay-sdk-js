import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import { normalizePath, signRequest } from "@/index";

test("signRequest signs timestamp, method, path, and raw body", () => {
  const input = {
    secretKey: "sk_test_secret",
    timestamp: "1778353137",
    method: "POST" as const,
    path: "/api/v1/payments",
    rawBody: '{"amount":200,"currency":"XAF","payer_phone":"+237694010263"}',
  };

  const expected = crypto
    .createHmac("sha256", input.secretKey)
    .update(`${input.timestamp}${input.method}${input.path}${input.rawBody}`)
    .digest("hex");

  assert.equal(signRequest(input), expected);
});

test("normalizePath keeps path and query only", () => {
  assert.equal(
    normalizePath("https://api.genuka.com/api/v1/payments?limit=10&page=2"),
    "/api/v1/payments?limit=10&page=2",
  );
});

test("normalizePath prefixes relative paths", () => {
  assert.equal(normalizePath("api/v1/payments"), "/api/v1/payments");
});
