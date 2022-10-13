import { GetStaticProps } from "next";
import { MetaData } from "types/post";
import { getAllPostPath, getPost } from "utils/post";
import { SWRConfig, unstable_serialize } from "swr";
import PostView from "components/pages/postDetail/PostView";

interface PageProps {
  fallback: {
    [key: string]: {
      meta: MetaData;
      content: string;
    };
  };
}

const DetailPosts = () => {
  return (
    <>
      <PostView />
    </>
  );
};

export const getStaticPaths = () => {
  const paths = getAllPostPath();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = (context) => {
  const id = context?.params?.id;

  if (!id || typeof id !== "string")
    return {
      props: {
        fallback: {},
      },
    };

  const post = getPost(id);

  return {
    props: {
      fallback: {
        [unstable_serialize(["post", id])]: post,
      },
    },
  };
};

const DetailPostsPage = ({ fallback }: PageProps) => {
  return (
    <SWRConfig value={{ fallback }}>
      <DetailPosts />
    </SWRConfig>
  );
};

export default DetailPostsPage;
