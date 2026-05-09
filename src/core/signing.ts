import crypto from "node:crypto";
import type { HttpMethod } from "@/types";

export type SignatureInput = {
  secretKey: string;
  timestamp: string;
  method: HttpMethod;
  path: string;
  rawBody: string;
};

export function signRequest(input: SignatureInput): string {
  const message = `${input.timestamp}${input.method}${input.path}${input.rawBody}`;

  return crypto
    .createHmac("sha256", input.secretKey)
    .update(message)
    .digest("hex");
}

export function normalizePath(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    const url = new URL(path);

    return `${url.pathname}${url.search}`;
  }

  return path.startsWith("/") ? path : `/${path}`;
}
