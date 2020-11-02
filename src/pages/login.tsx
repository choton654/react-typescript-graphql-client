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
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/maperror";
import { useRouter } from "next/router";
import NextLink from "next/link";

const Login: React.FunctionComponent<{}> = (props) => {
  const [login] = useLoginMutation();

  const router = useRouter();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOremail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const res = await login({
            variables: {
              usernameOremail: values.usernameOremail,
              password: values.password,
            },
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: "Query",
                  me: data?.login.user,
                },
              });
              cache.evict({ fieldName: "posts:{}" });
            },
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
export default Login;
