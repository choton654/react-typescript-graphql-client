import { Box, Button, Flex, Link } from "@chakra-ui/core";
import * as React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery, MeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useApolloClient } from "@apollo/client";

interface INavbarProps {}

const Navbar: React.FunctionComponent<INavbarProps> = (props) => {
  const [logout, { loading: logoutFetching }] = useLogoutMutation();
  const { data, loading, error } = useMeQuery({
    onError: (err) => console.log(err.message),
    skip: isServer(),
  });

  const apolloClient = useApolloClient();

  let body = null;

  if (loading) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );
  } else if (data && data.me) {
    body = (
      <Flex>
        <Box>
          {data.me.username}
          <Button
            ml={2}
            variant="link"
            isLoading={logoutFetching}
            onClick={async () => {
              await logout();
              await apolloClient.resetStore();
            }}
          >
            logout
          </Button>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} bg={"tan"} p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};

export default Navbar;
