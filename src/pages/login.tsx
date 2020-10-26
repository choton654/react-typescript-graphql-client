import {
  Button,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Input,
  Box,
} from "@chakra-ui/core";
import * as React from "react";
import { Formik, Field, Form } from "Formik";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useMutation } from "urql";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/maperror";
import { useRouter } from "next/router";

const Login: React.FunctionComponent<{}> = (props) => {
  const [, login] = useLoginMutation();

  const router = useRouter();

  return (
    <Wrapper varient="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          const res = await login({ options: values });
          if (res.data?.login.errors) {
            console.log(res.data.login.errors);
            setErrors(toErrorMap(res.data.login.errors));
          } else if (res.data?.login.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              label="Username"
              placeholder="username"
            />
            <Box mt={4}>
              <InputField
                name="password"
                label="Password"
                placeholder="password"
                type="password"
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
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
