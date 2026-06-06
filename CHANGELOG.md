# @genuka/pay-sdk

## 0.2.0

### Minor Changes

- Initial release of the Genuka Pay TypeScript SDK.

  ### Features

  - **PayinsResource** — create a payin (`POST /api/v1/payments`), list payins, check status by track ID
  - **PayoutsResource** — create a payout (`POST /api/v1/payouts`), list payouts, get by ID, cancel
  - **CheckoutResource** — create hosted checkout sessions
  - **HMAC request signing** — every request is signed with `X-Public-Key`, `X-Timestamp`, and `X-Signature` headers
  - **Idempotency support** — pass an `idempotencyKey` in `RequestOptions` to safely retry requests

  ### Types

  - `PayinCreatePayload` — strongly typed payin fields with typed `metadata` (`description`, `customer_name`)
  - `PayoutCreatePayload` — payout fields with mutual exclusivity docs for `payment_method_id` vs `recipient_phone + operator_code`
  - `HostedCheckoutCreatePayload`
  - `Payin`, `Payout`, `HostedCheckout` — concrete response types with all known API fields
  - `TransactionStatus` — union type for all possible transaction statuses
  - `ListParams` — filter, sort, per_page for paginated list endpoints
