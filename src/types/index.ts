export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type Currency = string;

export type E164PhoneNumber = `+${string}`;

export type GenukaClientConfig = {
  baseUrl?: string;
  publicKey: string;
  secretKey: string;
  fetch?: typeof fetch;
};

export type RequestOptions = {
  idempotencyKey?: string;
};

export type ListParams = {
  per_page?: number;
  filter?: Record<string, string | number | boolean | undefined>;
  sort?: string;
};

export type PayinCreatePayload = {
  amount: number;
  currency: Currency;
  payer_phone: E164PhoneNumber;
  operator_code?: string;
  external_id?: string;
  metadata?: Record<string, unknown>;
};

export type PayoutCreatePayload = {
  amount: number;
  currency: Currency;
  country?: string;
  recipient_phone?: E164PhoneNumber;
  operator_code?: string;
  payment_method_id?: string;
  recipient_first_name?: string;
  recipient_last_name?: string;
  external_id?: string;
  description?: string;
  metadata?: Record<string, unknown>;
};

export type HostedCheckoutCreatePayload = {
  amount: number;
  currency: Currency;
  description?: string;
  payer_name?: string;
  payer_email?: string;
  payer_phone?: E164PhoneNumber;
  return_url?: string;
  cancel_url?: string;
  expires_at?: string;
  metadata?: Record<string, unknown>;
};

export type GenukaResponse<TData> = {
  message?: string;
  data?: TData;
};

export type Payin = Record<string, unknown>;
export type Payout = Record<string, unknown>;
export type HostedCheckout = Record<string, unknown>;
