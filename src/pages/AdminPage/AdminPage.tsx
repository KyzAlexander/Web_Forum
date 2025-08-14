import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/usersSlice";
import { fetchPosts } from "../../redux/slices/postsSlice";
import { AppDispatch, RootState } from "../../redux/store";
import AdminUserCard from "../../components/AdminUserCard/AdminUserCard";
import Loader from "../../components/Loader/Loader";
import BackToLoginButton from "../../components/BackToLoginButton/BackToLoginButton";
import Pagination from "../../components/Pagination/Pagination";
import UserFilter from "../../components/UserFilter/UserFilter";
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

  const currentUser = filteredUsers[currentPage - 1];

  const currentUserPosts = currentUser
    ? posts.filter((p) => p.userId === currentUser.id)
    : [];

  // Сброс пагинации при смене фильтра
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredUserId]);

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Admin Panel</h1>

      <UserFilter
        users={users}
        value={filteredUserId}
        onChange={(val) => setFilteredUserId(val)}
      />

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
      {filteredUserId === null && (
        <Pagination
          totalItems={filteredUsers.length}
          itemsPerPage={1}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
      <BackToLoginButton />
    </div>
  );
};

export default AdminPage;
