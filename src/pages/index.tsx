import { withUrqlClient } from "next-urql";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/urqlClient";
import { dedupExchange, cacheExchange, fetchExchange } from "@urql/core";
import Navbar from "../components/Navbar";

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <div>
      <Navbar />
      <div>Hello world</div>
      <br />
      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((post) => <div key={post._id}>{post.title}</div>)
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
