import { Box, Button, Flex, Link } from "@chakra-ui/core";
import * as React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface INavbarProps {}

const Navbar: React.FunctionComponent<INavbarProps> = (props) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();

  let body = null;

  if (fetching) {
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
  } else if (data.me) {
    body = (
      <Flex>
        <Box>
          {data.me.username}
          <Button
            ml={2}
            variant="link"
            isLoading={logoutFetching}
            onClick={() => logout()}
          >
            logout
          </Button>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex bg={"tan"} p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};

export default Navbar;