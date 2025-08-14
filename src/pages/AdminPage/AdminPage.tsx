import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/usersSlice";
import { fetchPosts } from "../../redux/slices/postsSlice";
import { AppDispatch, RootState } from "../../redux/store";
import AdminUserCard from "../../components/AdminUserCard/AdminUserCard";
import Loader from "../../components/Loader/Loader";
import BackToLoginButton from "../../components/BackToLoginButton/BackToLoginButton";
import "./index.scss";

const AdminPage: React.FC = () => {
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

  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});

  const toggleComments = (postId: number) => {
    setOpenComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const isLoading = usersLoading || postsLoading || commentsLoading;

  const [filteredUserId, setFilteredUserId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchPosts());
  }, [dispatch]);

  const filteredUsers =
    filteredUserId !== null
      ? users.filter((u) => u.id === filteredUserId)
      : users;

  const totalPages = filteredUsers.length;
  const currentUser = filteredUsers[currentPage - 1];

  const currentUserPosts = currentUser
    ? posts.filter((p) => p.userId === currentUser.id)
    : [];

  const getPageNumbers = () => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    if (currentPage <= 4) {
      return [1, 2, 3, 4, "...", totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Сброс пагинации при смене фильтра
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredUserId]);

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Admin Panel</h1>

      <div className="filter">
        <label>Filter by user:</label>
        <select
          value={filteredUserId || ""}
          onChange={(e) => {
            const val = Number(e.target.value);
            setFilteredUserId(val || null);
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

      <h2 className="admin-page__section-title">Users</h2>
      {isLoading ? (
        <Loader />
      ) : currentUser ? (
        <AdminUserCard
          user={currentUser}
          posts={currentUserPosts}
          comments={comments}
          openComments={openComments}
          onToggleComments={toggleComments}
        />
      ) : (
        <p>No users found.</p>
      )}

      {/* Пагинация только если нет фильтра */}
      {filteredUserId === null && totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </button>

          {getPageNumbers().map((page, idx) =>
            page === "..." ? (
              <span key={idx} className="dots">
                ...
              </span>
            ) : (
              <button
                key={idx}
                className={currentPage === page ? "active" : ""}
                onClick={() => handlePageChange(page as number)}
              >
                {page}
              </button>
            )
          )}

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
      <BackToLoginButton />
    </div>
  );
};

export default AdminPage;
