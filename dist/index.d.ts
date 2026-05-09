type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Currency = string;
type E164PhoneNumber = `+${string}`;
type GenukaClientConfig = {
    baseUrl: string;
    publicKey: string;
    secretKey: string;
    fetch?: typeof fetch;
};
type RequestOptions = {
    idempotencyKey?: string;
};
type ListParams = {
    per_page?: number;
    filter?: Record<string, string | number | boolean | undefined>;
    sort?: string;
};
type PayinCreatePayload = {
    amount: number;
    currency: Currency;
    payer_phone: E164PhoneNumber;
    operator_code?: string;
    external_id?: string;
    metadata?: Record<string, unknown>;
};
type PayoutCreatePayload = {
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
type HostedCheckoutCreatePayload = {
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
type GenukaResponse<TData> = {
    message?: string;
    data?: TData;
};
type Payin = Record<string, unknown>;
type Payout = Record<string, unknown>;
type HostedCheckout = Record<string, unknown>;

type InternalRequestOptions = RequestOptions & {
    method: HttpMethod;
    path: string;
    body?: unknown;
    query?: Record<string, string | number | boolean | undefined>;
};
declare class HttpClient {
    private readonly config;
    private readonly fetcher;
    constructor(config: GenukaClientConfig);
    request<TResponse>(options: InternalRequestOptions): Promise<TResponse>;
    private buildPath;
    private trimBaseUrl;
}

declare class CheckoutResource {
    private readonly http;
    constructor(http: HttpClient);
    create(payload: HostedCheckoutCreatePayload): Promise<GenukaResponse<HostedCheckout>>;
    get(token: string): Promise<GenukaResponse<HostedCheckout>>;
}

declare class PayinsResource {
    private readonly http;
    constructor(http: HttpClient);
    create(payload: PayinCreatePayload, options?: RequestOptions): Promise<GenukaResponse<Payin>>;
    list(params?: ListParams): Promise<GenukaResponse<Payin[]>>;
    checkStatus(trackId: string): Promise<GenukaResponse<Payin>>;
}

declare class PayoutsResource {
    private readonly http;
    constructor(http: HttpClient);
    create(payload: PayoutCreatePayload, options?: RequestOptions): Promise<GenukaResponse<Payout>>;
    list(params?: ListParams): Promise<GenukaResponse<Payout[]>>;
    get(id: string, params?: {
        sync?: boolean;
    }): Promise<GenukaResponse<Payout>>;
    cancel(id: string): Promise<GenukaResponse<Payout>>;
}

declare class GenukaApiError extends Error {
    readonly status: number;
    readonly body: unknown;
    constructor(status: number, body: unknown);
}

type SignatureInput = {
    secretKey: string;
    timestamp: string;
    method: HttpMethod;
    path: string;
    rawBody: string;
};
declare function signRequest(input: SignatureInput): string;
declare function normalizePath(path: string): string;

declare class GenukaClient {
    readonly payins: PayinsResource;
    readonly payouts: PayoutsResource;
    readonly checkout: CheckoutResource;
    constructor(config: GenukaClientConfig);
}

export { type Currency, type E164PhoneNumber, GenukaApiError, GenukaClient, type GenukaClientConfig, type GenukaResponse, type HostedCheckout, type HostedCheckoutCreatePayload, type ListParams, type Payin, type PayinCreatePayload, type Payout, type PayoutCreatePayload, type RequestOptions, normalizePath, signRequest };
