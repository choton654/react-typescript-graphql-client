import { dedupExchange, fetchExchange, Exchange } from "@urql/core";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
} from "../generated/graphql";
import { Cache, QueryInput, cacheExchange } from "@urql/exchange-graphcache";
import { pipe, tap } from "wonka";
import Router from "next/router";

export function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes("not authenticated")) {
        Router.replace("/login");
      }
    })
  );
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: { credentials: "include" as const },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
            // invalidateAllPosts(cache);
          },
          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    me: result.register.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    ssrExchange,
    errorExchange,
    fetchExchange,
  ],
});

// keys: {
//   PaginatedPosts: () => null,
// },
// resolvers: {
//   Query: {
//     posts: cursorPagination(),
//   },
// },

// deletePost: (_result, args, cache, info) => {
//   cache.invalidate({
//     __typename: "Post",
//     id: (args as DeletePostMutationVariables).id,
//   });
// },
// vote: (_result, args, cache, info) => {
//   const { postId, value } = args as VoteMutationVariables;
//   const data = cache.readFragment(
//     gql`
//       fragment _ on Post {
//         id
//         points
//         voteStatus
//       }
//     `,
//     { id: postId } as any
//   );

//   if (data) {
//     if (data.voteStatus === value) {
//       return;
//     }
//     const newPoints =
//       (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
//     cache.writeFragment(
//       gql`
//         fragment __ on Post {
//           points
//           voteStatus
//         }
//       `,
//       { id: postId, points: newPoints, voteStatus: value } as any
//     );
//   }
// },
// createPost: (_result, args, cache, info) => {
//   invalidateAllPosts(cache);
// },
