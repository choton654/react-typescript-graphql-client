import { useMemo } from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { concatPagination } from "@apollo/client/utilities";
import merge from "deepmerge";
import { PginatePosts } from "../generated/graphql";

let apolloClient: ApolloClient<NormalizedCacheObject>;

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: "http://localhost:5000/graphql", // Server URL (must be absolute)
      credentials: "include", // Additional fetch() options like `credentials` or `headers`
    }),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: [],
              merge(
                existing: PginatePosts | undefined,
                incoming: PginatePosts
              ): PginatePosts {
                return {
                  ...incoming,
                  posts: [...(existing?.posts || []), ...incoming.posts],
                };
              },
            },
          },
        },
      },
    }),
  });
}

export function initializeApollo(initialState: any = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache);

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState: null | undefined) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
