import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import useSWR, { SWRConfig } from "swr";
import { MetaData } from "types/post";
import { getAllPostMetaData } from "utils/post";
import { css } from "@emotion/react";

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
      <div css={wrapper}>
        <div css={postListBox}>
          {postsMetaData.map((post) => (
            <div key={post.path} css={postBox}>
              <Link href={`/${post.path}`}>
                <a>
                  <h1 css={h1}>{post.title}</h1>
                  <h2 css={h2}>{post.description}</h2>
                  <div css={footerBox}>
                    <h3>{post.date}</h3>
                    <div css={tagBox}>
                      {post.tags.map((tag) => (
                        <div key={tag} css={Stag}>
                          {tag}
                        </div>
                      ))}
                    </div>
                  </div>
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

  return {
    props: {
      fallback: {
        "/api/posts": allPostMetaData,
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

const footerBox = css({
  display: "flex",
});

const Stag = css({
  backgroundColor: "#c9d1d9",
  color: "#0d1117",
  padding: "0.25rem 0.5rem",
  borderRadius: "0.25rem",
  fontSize: "0.75rem",
  lineHeight: "1",
  marginRight: "0.5rem",
  width: "fit-content",
  height: "fit-content",
  fontWeight: "700",
});

const tagBox = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginLeft: "2rem",
});

const h2 = css({
  fontSize: "1.1rem",
  fontWeight: "500",
});

const h1 = css({
  fontSize: "2rem",
  fontWeight: "bold",
});

const postBox = css({
  marginBottom: "2rem",
});

const postListBox = css({
  marginTop: "2rem",
});

const wrapper = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "100%",
  minHeight: "calc(100vh - 4rem - 3rem)",
  width: "100%",
  color: "#c9d1d9",
  backgroundColor: "#0d1117",
});
