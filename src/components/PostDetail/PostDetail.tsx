import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchCommentsByPostId } from "../../redux/slices/commentsSlice";
import {
  toggleLike,
  toggleDislike,
  toggleFavorite,
  Post,
} from "../../redux/slices/postsSlice";
import { addComment } from "../../redux/slices/commentsSlice";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { FaStar } from "react-icons/fa";
import AddCommentForm from "../AddCommentForm/AddCommentForm";
import BackToLoginButton from "../BackToLoginButton/BackToLoginButton";
import "./index.scss";


const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const post = useSelector((state: RootState) =>
    state.posts.posts.find((p) => p.id === Number(postId))
  );
  const comments = useSelector(
    (state: RootState) => state.comments.comments[Number(postId)] || []
  );

  useEffect(() => {
    if (postId) {
      dispatch(fetchCommentsByPostId(Number(postId)));
    }
  }, [dispatch, postId]);

  const handleLike = (post: Post) => {
    dispatch(toggleLike(post.id));
  };

  const handleDislike = (post: Post) => {
    dispatch(toggleDislike(post.id));
  };

  const handleFavorite = (post: Post) => {
    dispatch(toggleFavorite(post.id));
  };

  const handleAddComment = (commentBody: string) => {
    dispatch(addComment({ postId: Number(postId), body: commentBody }));
  };

  return (
    <>
      {!post ? (
        <div>Post not found</div>
      ) : (
        <div className="post-detail">
          <h1>{post.title}</h1>
          <p>{post.body}</p>

          <div className="post-buttons">
            <div className="like-btn" onClick={() => handleLike(post)}>
              <AiFillLike size={30} color={post.liked ? "f0768b" : "#ccc"} />
            </div>
            <div className="dislike-btn" onClick={() => handleDislike(post)}>
              <AiFillDislike
                size={30}
                color={post.disliked ? "f0768b" : "#ccc"}
              />
            </div>

            <div className="favorites-btn" onClick={() => handleFavorite(post)}>
              <FaStar size={30} color={post.favorite ? "#ffd700" : "#ccc"} />
            </div>
          </div>
          <div className="comments-section">
            <h2>Comments</h2>
            <ul>
              {comments.map((comment) => (
                <li key={comment.id}>{comment.body}</li>
              ))}
            </ul>
            <AddCommentForm onAddComment={handleAddComment} />
          </div>
        </div>
      )}
      <BackToLoginButton />
    </>
  );
};

export default PostDetail;
