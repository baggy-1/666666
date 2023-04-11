import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGemoji from "remark-gemoji";
import { MetaData } from "types/post";
import remarkHighlightjs from "remark-highlight.js";
import remarkGfm from "remark-gfm";

const postsDirectory = path.join(process.cwd(), "_posts");

const replaceExtension = (path: string, extension: string) => {
  const regExp = new RegExp(`\.${extension}$`);
  return path.replace(regExp, "");
};

const readDirPosts = () => {
  return fs.readdirSync(postsDirectory, { encoding: "utf-8" });
};

const getAllPostPath = () => {
  const allPost = readDirPosts();
  const allPostPath = allPost.map((post) => ({
    params: {
      id: replaceExtension(post, "md"),
    },
  }));

  return allPostPath;
};

const getPublicPostMetaData = () => {
  const posts = readDirPosts();

  const postMetaData = posts.map((post) => {
    const readPost = matter.read(`${postsDirectory}/${post}`);
    const path = replaceExtension(post, "md");

    return {
      path,
      ...(readPost.data as MetaData),
    };
  });

  const publicPostMetaData = postMetaData.filter(
    ({ public: _public }) => _public
  );

  const sortPostMetaData = publicPostMetaData
    .slice()
    .sort(({ date: a }, { date: b }) => {
      if (a < b) return 1;
      if (a > b) return -1;
      return 0;
    });

  return sortPostMetaData;
};

const getPost = (path: string) => {
  const post = matter.read(`${postsDirectory}/${path}.md`);
  const { content: postContent, data: meta } = post;
  const parseContent = remark()
    .use(remarkHtml, { sanitize: false })
    .use(remarkGfm)
    .use(remarkHighlightjs)
    .use(remarkGemoji)
    .processSync(postContent)
    .value.toString();

  return {
    meta,
    content: parseContent,
  };
};

export { getPublicPostMetaData, getPost, getAllPostPath };
