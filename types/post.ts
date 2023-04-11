interface MetaData {
  categories: string[];
  date: string;
  description: string;
  tags: string[];
  title: string;
  public: boolean;
}

interface MetaDataPath extends MetaData {
  path: string;
}

interface Post {
  meta: MetaData;
  content: string;
}

export type { MetaData, MetaDataPath, Post };
