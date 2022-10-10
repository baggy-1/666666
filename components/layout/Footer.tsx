import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "3rem",
        width: "100%",
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
          cursor: "pointer",
        }}
      >
        <Link href={`https://github.com/chigomuh/666666`}>
          <a>
            <Image
              src={`/svg/github-icon.svg`}
              alt={`github-icon`}
              width={32}
              height={32}
            />
          </a>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
