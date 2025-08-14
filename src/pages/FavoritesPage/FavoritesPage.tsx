import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
  toggleLike,
  toggleDislike,
  toggleFavorite,
} from "../../redux/slices/postsSlice";
import UserWithPosts from "../../components/UserWithPosts/UserWithPosts";
import BackToLoginButton from "../../components/BackToLoginButton/BackToLoginButton";
import "./index.scss";

const FavoritesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { posts } = useSelector((state: RootState) => state.posts);
  const { users } = useSelector((state: RootState) => state.users);
  const { comments } = useSelector((state: RootState) => state.comments);

  const [openComments, setOpenComments] = React.useState<Record<number, boolean>>({});

  const toggleComments = (postId: number) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const favoritePosts = posts.filter((post) => post.favorite);

  // Группируем по пользователям
  const groupedByUser = favoritePosts.reduce(
    (acc: Record<number, typeof favoritePosts>, post) => {
      if (!acc[post.userId]) acc[post.userId] = [];
      acc[post.userId].push(post);
      return acc;
    },
    {}
  );

  return (
    <div className="favorites-page">
      <h1>⭐ Favorite Posts</h1>

      {favoritePosts.length === 0 ? (
        <p className="no-favorites">No favorite posts yet.</p>
      ) : (
        <div className="user-list">
          {Object.entries(groupedByUser).map(([userId, userPosts]) => {
            const user = users.find((u) => u.id === Number(userId));
            if (!user) return null;
            return (
              <UserWithPosts
                key={user.id}
                user={user}
                posts={userPosts}
                comments={comments}
                openComments={openComments}
                onToggleLike={(postId) => dispatch(toggleLike(postId))}
                onToggleDislike={(postId) => dispatch(toggleDislike(postId))}
                onToggleFavorite={(postId) => dispatch(toggleFavorite(postId))}
                onToggleComments={toggleComments}
              />
            );
          })}
        </div>
      )}

      <BackToLoginButton />
    </div>
  );
};

export default FavoritesPage;