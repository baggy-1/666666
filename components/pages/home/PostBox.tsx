import { css } from "@emotion/react";
import Link from "next/link";
import { MetaDataPath } from "types/post";
import Tag from "components/pages/home/Tag";
import { mq } from "utils/styles";

interface Props {
  MetaDataPath: MetaDataPath;
}

const PostBox = ({ MetaDataPath }: Props) => {
  const { path, title, description, date, tags } = MetaDataPath;

  return (
    <div key={path} css={postBox}>
      <Link href={`/${path}`}>
        <a>
          <div css={textBox}>
            <h1 css={h1}>{title}</h1>
            <h2 css={h2}>{description}</h2>
          </div>
          <div css={footerBox}>
            <h3 css={S_date}>{date}</h3>
            <div css={tagBox}>
              {tags.map((tag) => (
                <Tag key={tag} tag={tag} />
              ))}
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

export default PostBox;

const S_date = css({
  padding: "0.5rem 0",
  [mq[0]]: {
    borderBottom: "1px solid #c9d1d9",
  },
});

const textBox = css({
  margin: "1rem 0rem",
  padding: "0 1rem",
});

const footerBox = css({
  display: "flex",
  justifyContent: "space-between",
  padding: "0 1rem",
  [mq[0]]: {
    fontSize: "0.8rem",
    flexDirection: "column",
    justifyContent: "start",
  },
});

const tagBox = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginLeft: "2rem",
  [mq[0]]: {
    justifyContent: "start",
    marginLeft: "0",
    padding: "1rem 0",
  },
});

const h2 = css({
  fontSize: "1.1rem",
  fontWeight: "500",
  [mq[0]]: {
    fontSize: "1rem",
  },
});

const h1 = css({
  fontSize: "2rem",
  fontWeight: "bold",
  [mq[0]]: {
    fontSize: "1.5rem",
  },
});

const postBox = css({
  marginBottom: "2rem",
  border: "1px solid #c9d1d9",
  borderRadius: "0.8rem",
  [mq[0]]: {
    margin: "0 2rem",
    marginBottom: "2rem",
  },
});
