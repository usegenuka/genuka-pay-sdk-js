import type { ListParams } from "@/types";

export function formatListParams(
  params?: ListParams,
): Record<string, string | number | boolean | undefined> {
  const query: Record<string, string | number | boolean | undefined> = {};

  if (params?.per_page !== undefined) {
    query.per_page = params.per_page;
  }

  if (params?.sort !== undefined) {
    query.sort = params.sort;
  }

  for (const [key, value] of Object.entries(params?.filter ?? {})) {
    query[`filter[${key}]`] = value;
  }

  return query;
}
