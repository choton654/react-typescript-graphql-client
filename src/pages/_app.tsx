import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import { createClient, Provider } from "urql";
import Navbar from "../components/Navbar";
import theme from "../theme";
import { dedupExchange, cacheExchange, fetchExchange } from "@urql/core";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/urqlClient";

function MyApp({ Component, pageProps }: any) {
  const client = createClient({
    url: "http://localhost:4000/graphql",
    fetchOptions: { credentials: "include" },
  });

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Navbar />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(MyApp);

// export default MyApp;
