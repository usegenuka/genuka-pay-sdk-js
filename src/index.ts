import { HttpClient } from "@/core/client";
import { CheckoutResource, PayinsResource, PayoutsResource } from "@/resources";
import type { GenukaClientConfig } from "@/types";

export class GenukaClient {
  public readonly payins: PayinsResource;
  public readonly payouts: PayoutsResource;
  public readonly checkout: CheckoutResource;

  constructor(config: GenukaClientConfig) {
    const http = new HttpClient(config);

    this.payins = new PayinsResource(http);
    this.payouts = new PayoutsResource(http);
    this.checkout = new CheckoutResource(http);
  }
}

export { GenukaApiError } from "@/core/errors";
export { normalizePath, signRequest } from "@/core/signing";
export type {
  Currency,
  E164PhoneNumber,
  GenukaClientConfig,
  GenukaResponse,
  HostedCheckout,
  HostedCheckoutCreatePayload,
  ListParams,
  Payin,
  PayinCreatePayload,
  Payout,
  PayoutCreatePayload,
  RequestOptions,
} from "@/types";
