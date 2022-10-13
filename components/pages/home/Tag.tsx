import { css } from "@emotion/react";

interface Props {
  tag: string;
}

const Tag = ({ tag }: Props) => {
  return <div css={S_tag}>{tag}</div>;
};

export default Tag;

const S_tag = css({
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
