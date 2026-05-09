import { GenukaApiError } from "@/core/errors";
import { normalizePath, signRequest } from "@/core/signing";
import type { GenukaClientConfig, HttpMethod, RequestOptions } from "@/types";

const DEFAULT_BASE_URL = "https://staging-api-pay.genuka.com";

type InternalRequestOptions = RequestOptions & {
  method: HttpMethod;
  path: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
};

export class HttpClient {
  private readonly fetcher: typeof fetch;

  constructor(private readonly config: GenukaClientConfig) {
    this.fetcher = config.fetch ?? fetch;
  }

  async request<TResponse>(options: InternalRequestOptions): Promise<TResponse> {
    const method = options.method.toUpperCase() as HttpMethod;
    const path = this.buildPath(options.path, options.query);
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const rawBody = options.body === undefined ? "" : JSON.stringify(options.body);
    const signature = signRequest({
      secretKey: this.config.secretKey,
      timestamp,
      method,
      path,
      rawBody,
    });

    const headers: Record<string, string> = {
      Accept: "application/json",
      "X-Public-Key": this.config.publicKey,
      "X-Timestamp": timestamp,
      "X-Signature": signature,
    };

    if (rawBody !== "") {
      headers["Content-Type"] = "application/json";
    }

    if (options.idempotencyKey !== undefined) {
      headers["Idempotency-Key"] = options.idempotencyKey;
    }

    const requestInit: RequestInit = {
      method,
      headers,
    };

    if (rawBody !== "") {
      requestInit.body = rawBody;
    }

    const response = await this.fetcher(`${this.trimBaseUrl()}${path}`, requestInit);

    const responseBody = await response.json().catch(() => null);

    if (!response.ok) {
      throw new GenukaApiError(response.status, responseBody);
    }

    return responseBody as TResponse;
  }

  private buildPath(
    path: string,
    query?: Record<string, string | number | boolean | undefined>,
  ): string {
    const normalizedPath = normalizePath(path);

    if (query === undefined) {
      return normalizedPath;
    }

    const urlSearchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) {
        urlSearchParams.set(key, String(value));
      }
    }

    const queryString = urlSearchParams.toString();

    if (queryString === "") {
      return normalizedPath;
    }

    return `${normalizedPath}${normalizedPath.includes("?") ? "&" : "?"}${queryString}`;
  }

  private trimBaseUrl(): string {
    return (this.config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
  }
}
