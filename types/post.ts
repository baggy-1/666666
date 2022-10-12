interface MetaData {
  categories: string[];
  date: string;
  description: string;
  tags: string[];
  title: string;
}

interface Post {
  meta: MetaData;
  content: string;
}

export type { MetaData, Post };
