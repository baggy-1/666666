import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import useSWR, { SWRConfig, unstable_serialize } from "swr";
import { MetaData } from "types/post";
import { getAllPostMetaData } from "utils/post";

interface MetaDataPath extends MetaData {
  path: string;
}

interface PageProps {
  fallback: {
    [key: string]: MetaDataPath[];
  };
}

const Home: NextPage = () => {
  const { data: postsMetaData } = useSWR<MetaDataPath[]>("/api/posts");
  if (!postsMetaData) return <div>post 없음</div>;

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          minHeight: "calc(100vh - 4rem - 3rem)",
          width: "100%",
          color: "#c9d1d9",
          backgroundColor: "#0d1117",
        }}
      >
        <div
          style={{
            marginTop: "2rem",
          }}
        >
          {postsMetaData.map((post) => (
            <div
              key={post.id}
              style={{
                marginBottom: "1rem",
              }}
            >
              <Link href={`/${post.path}`}>
                <a>
                  <div>
                    <h1
                      style={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                      }}
                    >
                      {post.title}
                    </h1>
                    <h2
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "500",
                      }}
                    >
                      {post.description}
                    </h2>
                  </div>
                  <h3>{post.date}</h3>
                </a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = () => {
  const allPostMetaData = getAllPostMetaData();
  const sortAllPostMetaData = allPostMetaData
    .slice()
    .sort((a, b) => b.id - a.id);
  return {
    props: {
      fallback: {
        "/api/posts": sortAllPostMetaData,
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
