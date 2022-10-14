import type { GetStaticProps, NextPage } from "next";
import { SWRConfig } from "swr";
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
        post: allPostMetaData,
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
