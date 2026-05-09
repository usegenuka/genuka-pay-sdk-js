export class GenukaApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(`Genuka API request failed with status ${status}`);
    this.name = "GenukaApiError";
  }
}
