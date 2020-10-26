import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import { createClient, Provider } from "urql";
import Navbar from "../components/Navbar";
import theme from "../theme";

function MyApp({ Component, pageProps }: any) {
  const client = createClient({
    url: "http://localhost:4000/graphql",
    fetchOptions: { credentials: "include" },
  });

  return (
    <Provider value={client}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Navbar />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
