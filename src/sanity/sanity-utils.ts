import { createClient, QueryParams } from "next-sanity";
import clientConfig from "./config/client-config";

export const client = createClient(clientConfig);

export async function sanityFetch<QueryResponse>({
  query,
  qParams,
  tags,
  revalidate,
}: {
  query: string;
  qParams: QueryParams;
  tags: string[];
  revalidate?: number | false;
}) {
  const cacheConfig = process.env.SANITY_HOOK_SECRET
    ? {
        cache: "force-cache" as const,
        next: {
          tags,
          ...(revalidate !== undefined && { revalidate }),
        },
      }
    : {
        cache: "no-cache" as const,
        next: { tags },
      };

  return client.fetch<QueryResponse>(query, qParams, cacheConfig);
}
