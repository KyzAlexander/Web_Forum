import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchUsers } from "../../redux/slices/usersSlice";
import {
  fetchPosts,
  toggleDislike,
  toggleFavorite,
  toggleLike,
} from "../../redux/slices/postsSlice";
import { fetchCommentsByPostId } from "../../redux/slices/commentsSlice";
import UserWithPosts from "../../components/UserWithPosts/UserWithPosts";
import Loader from "../../components/Loader/Loader";
import BackToLoginButton from "../../components/BackToLoginButton/BackToLoginButton";
import FavoritesPostsButton from "../../components/FavoritesPostsButton/FavoritesPostsButton";
import Pagination from "../../components/Pagination/Pagination";
import UserFilter from "../../components/UserFilter/UserFilter";
import "./index.scss";

const UserPostsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { users, loading: usersLoading } = useSelector(
    (state: RootState) => state.users
  );
  const { posts, loading: postsLoading } = useSelector(
    (state: RootState) => state.posts
  );
  const { comments, loading: commentsLoading } = useSelector(
    (state: RootState) => state.comments
  );
  const [filteredUserId, setFilteredUserId] = useState<number | null>(null);
  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const isLoading = postsLoading || usersLoading || commentsLoading;

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    posts.forEach((post) => {
      if (!comments[post.id]) {
        dispatch(fetchCommentsByPostId(post.id));
      }
    });
  }, [dispatch, posts, comments]);

  const toggleComments = (postId: number) => {
    setOpenComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const filteredPosts =
    filteredUserId === null
      ? posts
      : posts.filter((post) => post.userId === filteredUserId);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Группируем посты по пользователям для UserWithPosts
  const groupedByUser = currentPosts.reduce((acc: Record<number, typeof currentPosts>, post) => {
    if (!acc[post.userId]) acc[post.userId] = [];
    acc[post.userId].push(post);
    return acc;
  }, {});

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="user-posts-page">
          <h1>User Posts</h1>

          <UserFilter
            users={users}
            value={filteredUserId}
            onChange={(val) => {
              setFilteredUserId(val);
              setCurrentPage(1); // сброс на первую страницу
            }} />

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
          <Pagination
            totalItems={filteredPosts.length}
            itemsPerPage={postsPerPage}
            currentPage={currentPage}
            onPageChange={(page) => {
              setCurrentPage(page);
            }}
          />
          <BackToLoginButton />
          <FavoritesPostsButton />
        </div>
      )}
    </>
  );
};

export default UserPostsPage;
