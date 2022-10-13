import type { GetStaticProps, NextPage } from "next";
import { SWRConfig, unstable_serialize } from "swr";
import { MetaDataPath } from "types/post";
import { getAllPostMetaData } from "utils/post";
import PostListView from "components/pages/home/PostListView";

interface PageProps {
  fallback: {
    [key: string]: MetaDataPath[];
  };
}

const Home: NextPage = () => {
  return (
    <>
      <PostListView />
    </>
  );
};

export const getStaticProps: GetStaticProps = () => {
  const allPostMetaData = getAllPostMetaData();

  return {
    props: {
      fallback: {
        [unstable_serialize(["post", "all"])]: allPostMetaData,
      },
    },
  };
};

const HomePage = ({ fallback }: PageProps) => {
  return (
    <SWRConfig value={{ fallback }}>
      <Home />
    </SWRConfig>
  );
};

export default HomePage;
