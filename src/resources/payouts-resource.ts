import type { HttpClient } from "@/core/client";
import { formatListParams } from "@/utils/format-list-params";
import type {
  GenukaResponse,
  ListParams,
  Payout,
  PayoutCreatePayload,
  RequestOptions,
} from "@/types";

export class PayoutsResource {
  constructor(private readonly http: HttpClient) {}

  create(
    payload: PayoutCreatePayload,
    options: RequestOptions = {},
  ): Promise<GenukaResponse<Payout>> {
    return this.http.request({
      method: "POST",
      path: "/api/v1/payouts",
      body: payload,
      ...(options.idempotencyKey !== undefined && {
        idempotencyKey: options.idempotencyKey,
      }),
    });
  }

  list(params?: ListParams): Promise<GenukaResponse<Payout[]>> {
    return this.http.request({
      method: "GET",
      path: "/api/v1/payouts",
      query: formatListParams(params),
    });
  }

  get(id: string, params?: { sync?: boolean }): Promise<GenukaResponse<Payout>> {
    return this.http.request({
      method: "GET",
      path: `/api/v1/payouts/${encodeURIComponent(id)}`,
      ...(params !== undefined && { query: params }),
    });
  }

  cancel(id: string): Promise<GenukaResponse<Payout>> {
    return this.http.request({
      method: "POST",
      path: `/api/v1/payouts/${encodeURIComponent(id)}/cancel`,
    });
  }
}
