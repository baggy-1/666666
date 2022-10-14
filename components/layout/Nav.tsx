import { css } from "@emotion/react";
import Link from "next/link";

const Nav = () => {
  return (
    <nav css={nav}>
      <div css={wrapper}>
        <p css={p}>
          <Link href={"/"}>
            <a>{`<Blog />`}</a>
          </Link>
        </p>
      </div>
    </nav>
  );
};

export default Nav;

const p = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "800",
  fontSize: "2rem",
  margin: "0",
  padding: "0",
});

const wrapper = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
});

const nav = css({
  position: "fixed",
  width: "100%",
  height: "4rem",
  color: "#c9d1d9",
  backgroundColor: "#0d1117",
});
