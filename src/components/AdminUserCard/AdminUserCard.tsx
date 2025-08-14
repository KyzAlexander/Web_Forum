import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../redux/slices/usersSlice";
import {
  deletePost,
  movePostToTop,
  swapPosts,
} from "../../redux/slices/postsSlice";
import { AppDispatch } from "../../redux/store";

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
}

interface IAdminUserCardProps {
  user: User;
  posts: Post[];
  comments: Record<number, { id: number; body: string }[]>;
  openComments: Record<number, boolean>;
  onToggleComments: (postId: number) => void;
}

const AdminUserCard: React.FC<IAdminUserCardProps> = ({ user, posts, comments, openComments, onToggleComments }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");

  useEffect(() => {
    if (editingUser !== null) {
      setEditedName(user.name);
      setEditedEmail(user.email);
    }
  }, [user, editingUser]);

  return (
    <div className="user-card">
      {editingUser === user.id ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            dispatch(
              updateUserProfile({
                id: user.id,
                name: editedName,
                email: editedEmail,
              })
            );
            setEditingUser(null);
          }}
          className="edit-form"
        >
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            placeholder="Name"
          />
          <input
            type="email"
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
            placeholder="Email"
          />
          <button type="submit" className="button button--save">
            Save
          </button>
          <button
            type="button"
            className="button button--cancel"
            onClick={() => setEditingUser(null)}
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="user-card__info">
          <p className="user-card__name">{user.name}</p>
          <p className="user-card__email">{user.email}</p>
          <button
            className="button button--edit"
            onClick={() => setEditingUser(user.id)}
          >
            Edit
          </button>
        </div>
      )}

      <h3 className="user-card__posts-title">Posts</h3>

      {posts.map((post, index) => (
        <div className="post-card" key={post.id}>
          <p className="post-card__title">{post.title}</p>
          <p className="post-card__subtitle">{post.body}</p>
          <div className="post-card__buttons">
            <button
              className="button button--delete"
              onClick={() => dispatch(deletePost(post.id))}
            >
              Delete
            </button>
            <button
              className="button button--top"
              onClick={() => dispatch(movePostToTop(post.id))}
            >
              Move to Top
            </button>
            {index > 0 && (
              <button
                className="button button--swap"
                onClick={() =>
                  dispatch(
                    swapPosts({
                      userId: user.id,
                      postId1: post.id,
                      postId2: posts[index - 1].id,
                    })
                  )
                }
              >
                Swap with Above
              </button>
            )}
          </div>
          <div className="comments-toggle-btn">
            <button onClick={() => onToggleComments(post.id)}>
              {openComments[post.id] ? "Hide Comments" : "Show Comments"}
            </button>
          </div>
          {openComments[post.id] && (
            <div className="comments-section">
              <h4>Comments</h4>
              <ul>
                {(comments[post.id] || []).map((comment) => (
                  <li key={comment.id}>
                    <p>{comment.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminUserCard;
