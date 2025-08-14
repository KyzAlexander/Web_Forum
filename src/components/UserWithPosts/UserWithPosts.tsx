import React from "react";
import { Link } from "react-router-dom";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import CommentsSection from "../CommentsSection/CommentsSection";
import "./index.scss";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
  liked: boolean;
  disliked: boolean;
  favorite: boolean;
}

interface IUserWithPostsProps {
  user: User;
  posts: Post[];
  comments: Record<number, { id: number; body: string }[]>;
  openComments: Record<number, boolean>;
  onToggleLike: (postId: number) => void;
  onToggleDislike: (postId: number) => void;
  onToggleFavorite: (postId: number) => void;
  onToggleComments: (postId: number) => void;
}

const UserWithPosts: React.FC<IUserWithPostsProps> = ({
  user,
  posts,
  comments,
  openComments,
  onToggleLike,
  onToggleDislike,
  onToggleFavorite,
  onToggleComments,
}) => (
  <div className="user">
    <Link className="link" to={`/user/${user.id}`}>
      <h2>{user.name}</h2>
    </Link>
    <p>Email: {user.email}</p>
    <div className="posts">
      {posts.map((post) => (
        <div key={post.id} className="post">
          <Link className="link" to={`/post/${post.id}`}>
            <h3>{post.title}</h3>
          </Link>
          <p>{post.body}</p>
          <div className="post-actions">
            <div className="like-btn" onClick={() => onToggleLike(post.id)}>
              <AiFillLike size={30} color={post.liked ? "f0768b" : "#ccc"} />
            </div>
            <div
              className="dislike-btn"
              onClick={() => onToggleDislike(post.id)}
            >
              <AiFillDislike
                size={30}
                color={post.disliked ? "f0768b" : "#ccc"}
              />
            </div>

            <div
              className="favorites-btn"
              onClick={() => onToggleFavorite(post.id)}
            >
              <FaStar size={30} color={post.favorite ? "#ffd700" : "#ccc"} />
            </div>
          </div>

          <CommentsSection
            postId={post.id}
            comments={comments[post.id] || []}
            isOpen={openComments[post.id] || false}
            onToggle={onToggleComments}
          />
        </div>
      ))}
    </div>
  </div>
);

export default UserWithPosts;
