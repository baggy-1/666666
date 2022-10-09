/**
 * node.js 내장 모듈인 fs를 사용하여 파일 읽기
 * readdir vs. readdirSync
 * readdir은 비동기, readdirSync는 동기
 * 파일 목록을 가져와서 props로 넘겨줘야 하기에 readdirSync 사용
 *
 * gray-matter vs. front-matter
 * npmtrends.com/gray-matter-vs-front-matter
 * gray-matter 다운로드가 2배정도 많음
 */

import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGemoji from "remark-gemoji";

const replaceExtension = (path: string, extension: string) => {
  const regExp = new RegExp(`\.${extension}$`);
  return path.replace(regExp, "");
};

const readDirPosts = () => {
  return fs.readdirSync("_posts", { encoding: "utf-8" });
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

const getAllPostMetaData = () => {
  const posts = readDirPosts();

  const postMetaData = posts.map((post) => {
    const readPost = matter.read(`_posts/${post}`);
    const path = replaceExtension(post, "md");

    return {
      path,
      ...readPost.data,
    };
  });

  return postMetaData;
};

const getPost = async (path: string) => {
  const post = matter.read(`_posts/${path}.md`);
  const { content: postContent, data: meta } = post;
  const parseContent = await remark()
    .use(remarkHtml, { sanitize: false })
    .use(remarkGemoji)
    .processSync(postContent);

  const content = parseContent.value.toString();

  return {
    meta,
    content,
  };
};

export { getAllPostMetaData, getPost, getAllPostPath };
