import { Box, Flex, Link, Button } from "@chakra-ui/core";
import * as React from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { toErrorMap } from "../utils/maperror";
import { Formik, Field, Form } from "Formik";
import NextLink from "next/link";
import { useForgotPasswordMutation } from "../generated/graphql";

interface IForgotPasswordProps {}

const ForgotPassword: React.FunctionComponent<IForgotPasswordProps> = (
  props
) => {
  const [, forgetPassword] = useForgotPasswordMutation();

  const [complete, setcomplete] = React.useState(false);

  return (
    <Wrapper varient="small">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setErrors }) => {
          const res = await forgetPassword(values);
          setcomplete(true);
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>if email exists, we send an email to that email address</Box>
          ) : (
            <Form>
              <Box mt={4}>
                <InputField
                  name="email"
                  label="Email"
                  placeholder="email"
                  type="email"
                />
              </Box>
              <Button
                mt={4}
                variantColor="teal"
                isLoading={isSubmitting}
                type="submit"
              >
                Login
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  );
};

export default ForgotPassword;
