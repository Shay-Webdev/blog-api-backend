type TPost = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  isPublished: boolean;
  publishedDate: Date;
  updatedDate: Date;
};

type TUser = {
  id: number;
  username: string;
  email: string;
  password: string;
  isAuthor: boolean;
};

type TComment = {
  id: number;
  content: string;
  updatedDate: Date;
  postId: number;
  userId: number;
  isPosted: boolean;
  postedDate: Date;
};

export { TPost, TComment, TUser };
