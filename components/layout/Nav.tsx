import Link from "next/link";

const Nav = () => {
  return (
    <nav
      style={{
        display: "fixed",
        width: "100%",
        height: "4rem",
        color: "#c9d1d9",
        backgroundColor: "#0d1117",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <p
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: "800",
            fontSize: "2rem",
            margin: "0",
            padding: "0",
          }}
        >
          <Link href={"/"}>
            <a>{`<Blog />`}</a>
          </Link>
        </p>
      </div>
    </nav>
  );
};

export default Nav;
