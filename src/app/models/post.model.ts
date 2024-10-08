export interface Post {
  postId: string;
  title: string;
  summary: string;
  content: string;
  thumbnail: string;
  creator: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}
