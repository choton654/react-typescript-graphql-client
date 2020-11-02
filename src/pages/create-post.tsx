import { Box, Flex, Link, Button } from "@chakra-ui/core";
import React, { ReactElement } from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { toErrorMap } from "../utils/maperror";
import { Formik, Field, Form } from "Formik";
import { useCreatePostMutation, useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useIsAuth } from "../utils/useIsAuth";

interface Props {}

function CreatePost({}: Props): ReactElement {
  const [createPost] = useCreatePostMutation();
  const router = useRouter();

  useIsAuth();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
          const { errors } = await createPost({ variables: { input: values } });
          // if (error?.message.includes("not authenticated")) {
          //   router.push("/login");
          // } else {
          //   router.push("/");
          // }
          if (!errors) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" label="title" placeholder="Titlel" />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                label="text"
                placeholder="text"
              />
            </Box>
            <Button
              mt={4}
              variantColor="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              create post
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}
export default CreatePost;
