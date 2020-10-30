import {
  Button,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Input,
  Box,
  Link,
  Flex,
} from "@chakra-ui/core";
import * as React from "react";
import { Formik, Field, Form } from "Formik";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useMutation } from "urql";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/maperror";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/urqlClient";

const Login: React.FunctionComponent<{}> = (props) => {
  const [, login] = useLoginMutation();

  const router = useRouter();

  return (
    <Wrapper varient="small">
      <Formik
        initialValues={{ usernameOremail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const res = await login({
            usernameOremail: values.usernameOremail,
            password: values.password,
          });
          if (res.data?.login.errors) {
            setErrors(toErrorMap(res.data.login.errors));
          } else if (res.data?.login.user) {
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOremail"
              label="Username Or Email"
              placeholder="Username Or Email"
            />
            <Box mt={4}>
              <InputField
                name="password"
                label="Password"
                placeholder="password"
                type="password"
              />
            </Box>
            <Flex>
              <NextLink href="/forgot-password">
                <Link ml="auto">frogot-password?</Link>
              </NextLink>
            </Flex>
            <Button
              mt={4}
              variantColor="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};
export default withUrqlClient(createUrqlClient, { ssr: false })(Login);
