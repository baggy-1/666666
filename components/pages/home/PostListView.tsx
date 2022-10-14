import { css } from "@emotion/react";
import useSWR from "swr";
import { MetaDataPath } from "types/post";
import PostBox from "components/pages/home/PostBox";

const PostListView = () => {
  const { data: postsMetaData } = useSWR<MetaDataPath[]>("post");

  if (!postsMetaData) return <div>Sorry, No Posts</div>;

  return (
    <div css={wrapper}>
      <div css={postListBox}>
        {postsMetaData.map((MetaDataPath) => (
          <PostBox key={MetaDataPath.path} MetaDataPath={MetaDataPath} />
        ))}
      </div>
    </div>
  );
};

export default PostListView;

const postListBox = css({
  marginTop: "2rem",
  maxWidth: "50rem",
});

const wrapper = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  height: "100%",
  minHeight: "calc(100vh - 3rem)",
  width: "100%",
  color: "#c9d1d9",
  backgroundColor: "#0d1117",
  paddingTop: "6rem",
});
