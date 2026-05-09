import crypto from 'crypto';

// src/core/errors.ts
var GenukaApiError = class extends Error {
  constructor(status, body) {
    super(`Genuka API request failed with status ${status}`);
    this.status = status;
    this.body = body;
    this.name = "GenukaApiError";
  }
  status;
  body;
};
function signRequest(input) {
  const message = `${input.timestamp}${input.method}${input.path}${input.rawBody}`;
  return crypto.createHmac("sha256", input.secretKey).update(message).digest("hex");
}
function normalizePath(path) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    const url = new URL(path);
    return `${url.pathname}${url.search}`;
  }
  return path.startsWith("/") ? path : `/${path}`;
}

// src/core/client.ts
var HttpClient = class {
  constructor(config) {
    this.config = config;
    this.fetcher = config.fetch ?? fetch;
  }
  config;
  fetcher;
  async request(options) {
    const method = options.method.toUpperCase();
    const path = this.buildPath(options.path, options.query);
    const timestamp = Math.floor(Date.now() / 1e3).toString();
    const rawBody = options.body === void 0 ? "" : JSON.stringify(options.body);
    const signature = signRequest({
      secretKey: this.config.secretKey,
      timestamp,
      method,
      path,
      rawBody
    });
    const headers = {
      Accept: "application/json",
      "X-Public-Key": this.config.publicKey,
      "X-Timestamp": timestamp,
      "X-Signature": signature
    };
    if (rawBody !== "") {
      headers["Content-Type"] = "application/json";
    }
    if (options.idempotencyKey !== void 0) {
      headers["Idempotency-Key"] = options.idempotencyKey;
    }
    const requestInit = {
      method,
      headers
    };
    if (rawBody !== "") {
      requestInit.body = rawBody;
    }
    const response = await this.fetcher(`${this.trimBaseUrl()}${path}`, requestInit);
    const responseBody = await response.json().catch(() => null);
    if (!response.ok) {
      throw new GenukaApiError(response.status, responseBody);
    }
    return responseBody;
  }
  buildPath(path, query) {
    const normalizedPath = normalizePath(path);
    if (query === void 0) {
      return normalizedPath;
    }
    const urlSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== void 0) {
        urlSearchParams.set(key, String(value));
      }
    }
    const queryString = urlSearchParams.toString();
    if (queryString === "") {
      return normalizedPath;
    }
    return `${normalizedPath}${normalizedPath.includes("?") ? "&" : "?"}${queryString}`;
  }
  trimBaseUrl() {
    return this.config.baseUrl.replace(/\/+$/, "");
  }
};

// src/resources/checkout-resource.ts
var CheckoutResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  create(payload) {
    return this.http.request({
      method: "POST",
      path: "/api/v1/checkout",
      body: payload
    });
  }
  get(token) {
    return this.http.request({
      method: "GET",
      path: `/api/v1/checkout/${encodeURIComponent(token)}`
    });
  }
};

// src/utils/format-list-params.ts
function formatListParams(params) {
  const query = {};
  if (params?.per_page !== void 0) {
    query.per_page = params.per_page;
  }
  if (params?.sort !== void 0) {
    query.sort = params.sort;
  }
  for (const [key, value] of Object.entries(params?.filter ?? {})) {
    query[`filter[${key}]`] = value;
  }
  return query;
}

// src/resources/payins-resource.ts
var PayinsResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  create(payload, options = {}) {
    return this.http.request({
      method: "POST",
      path: "/api/v1/payments",
      body: payload,
      ...options.idempotencyKey !== void 0 && {
        idempotencyKey: options.idempotencyKey
      }
    });
  }
  list(params) {
    return this.http.request({
      method: "GET",
      path: "/api/v1/payments",
      query: formatListParams(params)
    });
  }
  checkStatus(trackId) {
    return this.http.request({
      method: "GET",
      path: `/api/v1/payments/status/${encodeURIComponent(trackId)}`
    });
  }
};

// src/resources/payouts-resource.ts
var PayoutsResource = class {
  constructor(http) {
    this.http = http;
  }
  http;
  create(payload, options = {}) {
    return this.http.request({
      method: "POST",
      path: "/api/v1/payouts",
      body: payload,
      ...options.idempotencyKey !== void 0 && {
        idempotencyKey: options.idempotencyKey
      }
    });
  }
  list(params) {
    return this.http.request({
      method: "GET",
      path: "/api/v1/payouts",
      query: formatListParams(params)
    });
  }
  get(id, params) {
    return this.http.request({
      method: "GET",
      path: `/api/v1/payouts/${encodeURIComponent(id)}`,
      ...params !== void 0 && { query: params }
    });
  }
  cancel(id) {
    return this.http.request({
      method: "POST",
      path: `/api/v1/payouts/${encodeURIComponent(id)}/cancel`
    });
  }
};

// src/index.ts
var GenukaClient = class {
  payins;
  payouts;
  checkout;
  constructor(config) {
    const http = new HttpClient(config);
    this.payins = new PayinsResource(http);
    this.payouts = new PayoutsResource(http);
    this.checkout = new CheckoutResource(http);
  }
};

export { GenukaApiError, GenukaClient, normalizePath, signRequest };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map