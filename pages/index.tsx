import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { MetaData } from "types/post";
import { getAllPostMetaData } from "utils/post";

interface MetaDataPath extends MetaData {
  path: string;
}

interface Props {
  allPostMetaData: MetaDataPath[];
}

const Home: NextPage<Props> = ({ allPostMetaData }) => {
  return (
    <>
      <div>홈</div>
      {allPostMetaData.map((post) => (
        <Link key={post.id} href={`/${post.path}`}>
          <a>
            <h1>{post.title}</h1>
            <h2>{post.description}</h2>
            <h3>{post.date}</h3>
          </a>
        </Link>
      ))}
    </>
  );
};

export const getStaticProps: GetStaticProps = () => {
  const allPostMetaData = getAllPostMetaData();
  return {
    props: { allPostMetaData },
  };
};

export default Home;
