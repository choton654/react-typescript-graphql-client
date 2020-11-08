import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import theme from "../theme";
import { Layout } from "../components/Layout";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import { PginatePosts, useMeQuery, User } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useApollo } from "../lib/apolloClient";
import { client } from "../utils/withApollo";

// const client = new ApolloClient({
//   uri: "http://localhost:5000/graphql",
//   credentials: "include",
//   cache: new InMemoryCache({
//     typePolicies: {
//       Query: {
//         fields: {
//           posts: {
//             keyArgs: [],
//             merge(
//               existing: PginatePosts | undefined,
//               incoming: PginatePosts
//             ): PginatePosts {
//               return {
//                 ...incoming,
//                 posts: [...(existing?.posts || []), ...incoming.posts],
//               };
//             },
//           },
//         },
//       },
//     },
//   }),
// });

function MyApp({ Component, pageProps }: any) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default MyApp;
