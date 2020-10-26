import { Box } from "@chakra-ui/core";
import * as React from "react";

interface IWrapperProps {
  varient?: "regular" | "small";
}

const Wrapper: React.FunctionComponent<IWrapperProps> = ({
  varient = "regular",
  children,
}) => {
  return (
    <Box
      mt={8}
      mx={"auto"}
      maxW={varient === "regular" ? "800px" : "400px"}
      w="100%"
    >
      {children}
    </Box>
  );
};

export default Wrapper;
