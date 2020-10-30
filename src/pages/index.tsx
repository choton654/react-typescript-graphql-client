import { withUrqlClient } from "next-urql";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/urqlClient";
import { Link } from "@chakra-ui/core";
import NextLink from "next/link";

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: { limit: 10 },
  });

  return (
    <div>
      <div>Hello world</div>
      <br />
      <NextLink href="/create-post">
        <Link>create post</Link>
      </NextLink>
      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((post) => <div key={post.id}>{post.title}</div>)
      )}
    </div>
  );
};

// export default withUrqlClient(
//   (ssrExchange) => ({
//     url: "http://localhost:4000/graphql",
//     exchanges: [dedupExchange, cacheExchange, ssrExchange, fetchExchange],
//   }),
//   { ssr: true }
// )(Index);

// export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
export default Index;
