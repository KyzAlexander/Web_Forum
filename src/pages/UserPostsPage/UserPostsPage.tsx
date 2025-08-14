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
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Группируем посты по пользователям для UserWithPosts
  const groupedByUser = currentPosts.reduce((acc: Record<number, typeof currentPosts>, post) => {
    if (!acc[post.userId]) acc[post.userId] = [];
    acc[post.userId].push(post);
    return acc;
  }, {});

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, "...", totalPages - 2, totalPages - 1, totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, 2, 3, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  // Прокрутка к началу списка при смене страницы
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="user-posts-page">
          <h1>User Posts</h1>
          <div className="filter">
            <label>Filter by user:</label>
            <select
              value={filteredUserId || ""}
              onChange={(e) => {
                setFilteredUserId(Number(e.target.value) || null)
                setCurrentPage(1) // сброс на первую страницу
              }}
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
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

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Prev
              </button>

              {getPageNumbers().map((page, index) => {
                if (page === "...") {
                  return (
                    <span key={`dots-${index}`} className="dots">
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={page}
                    className={currentPage === page ? "active" : ""}
                    onClick={() => handlePageChange(page as number)}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
          <BackToLoginButton />
          <FavoritesPostsButton />
        </div>
      )}
    </>
  );
};

export default UserPostsPage;
