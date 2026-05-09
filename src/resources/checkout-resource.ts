import type { HttpClient } from "@/core/client";
import type {
  GenukaResponse,
  HostedCheckout,
  HostedCheckoutCreatePayload,
} from "@/types";

export class CheckoutResource {
  constructor(private readonly http: HttpClient) {}

  create(payload: HostedCheckoutCreatePayload): Promise<GenukaResponse<HostedCheckout>> {
    return this.http.request({
      method: "POST",
      path: "/api/v1/checkout",
      body: payload,
    });
  }

  get(token: string): Promise<GenukaResponse<HostedCheckout>> {
    return this.http.request({
      method: "GET",
      path: `/api/v1/checkout/${encodeURIComponent(token)}`,
    });
  }
}
