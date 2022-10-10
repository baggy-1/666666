import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { MetaData } from "types/post";
import { getAllPostMetaData } from "utils/post";

interface MetaDataPath extends MetaData {
  path: string;
}

interface Props {
  sortAllPostMetaData: MetaDataPath[];
}

const Home: NextPage<Props> = ({ sortAllPostMetaData }) => {
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
          {sortAllPostMetaData.map((post) => (
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
    props: { sortAllPostMetaData },
  };
};

export default Home;
