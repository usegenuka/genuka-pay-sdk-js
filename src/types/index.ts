export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type Currency = string;

export type E164PhoneNumber = `+${string}`;

export type TransactionStatus =
  | "initiated"
  | "processing"
  | "success"
  | "failed"
  | "cancelled"
  | "refunded";

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
  metadata?: {
    description?: string;
    customer_name?: string;
    [key: string]: unknown;
  };
};

export type PayoutCreatePayload = {
  amount: number;
  currency: Currency;
  country?: string;
  /** Required if payment_method_id is not provided */
  recipient_phone?: E164PhoneNumber;
  /** Required if payment_method_id is not provided */
  operator_code?: string;
  /** Use a saved payment method instead of recipient_phone + operator_code */
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

export type Payin = {
  id: string;
  track_id: string;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  payer_phone?: string;
  operator_code?: string;
  external_id?: string;
  idempotency_key?: string;
  provider_fee_amount?: number;
  genuka_fee_amount?: number;
  total_fee_amount?: number;
  net_amount?: number;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type Payout = {
  id: string;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  recipient_phone?: string;
  operator_code?: string;
  external_id?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type HostedCheckout = {
  id: string;
  amount: number;
  currency: Currency;
  status: TransactionStatus;
  description?: string;
  payer_name?: string;
  payer_email?: string;
  payer_phone?: string;
  return_url?: string;
  cancel_url?: string;
  expires_at?: string;
  checkout_url?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};
