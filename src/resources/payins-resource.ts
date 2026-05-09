import type { HttpClient } from "@/core/client";
import { formatListParams } from "@/utils/format-list-params";
import type {
  GenukaResponse,
  ListParams,
  Payin,
  PayinCreatePayload,
  RequestOptions,
} from "@/types";

export class PayinsResource {
  constructor(private readonly http: HttpClient) {}

  create(
    payload: PayinCreatePayload,
    options: RequestOptions = {},
  ): Promise<GenukaResponse<Payin>> {
    return this.http.request({
      method: "POST",
      path: "/api/v1/payments",
      body: payload,
      ...(options.idempotencyKey !== undefined && {
        idempotencyKey: options.idempotencyKey,
      }),
    });
  }

  list(params?: ListParams): Promise<GenukaResponse<Payin[]>> {
    return this.http.request({
      method: "GET",
      path: "/api/v1/payments",
      query: formatListParams(params),
    });
  }

  checkStatus(trackId: string): Promise<GenukaResponse<Payin>> {
    return this.http.request({
      method: "GET",
      path: `/api/v1/payments/status/${encodeURIComponent(trackId)}`,
    });
  }
}
