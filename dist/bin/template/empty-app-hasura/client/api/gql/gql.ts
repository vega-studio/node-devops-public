import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { ENV } from "config/env/env.js";
import { headersToRecord } from "../../../../util/headers-to-record.js";
import { setContext } from "@apollo/client/link/context/index.js";

let GQL: ApolloClient<NormalizedCacheObject>;

/**
 * Retrieves an apollo client instance that can be used for graphql queries
 * against our hasura instance.
 */
export async function useGQL() {
  if (GQL) return GQL;

  const gqlHost = ENV.useApi(ENV.hostConfig.graphql, 1, "").get;

  const httpLink = createHttpLink({
    uri: gqlHost.path,
    headers: headersToRecord(gqlHost.headers),
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        "x-hasura-admin-secret": process.env.HASURA_GRAPHQL_ADMIN_SECRET,
      },
    };
  });

  GQL = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return GQL;
}
