import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import UserPostsPage from "./pages/UserPostsPage/UserPostsPage";
import PostDetail from "./components/PostDetail/PostDetail";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import UserAccountPage from "./pages/UserAccountPage/UserAccountPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import "./styles/_App.scss";
import FavoritesPage from "./pages/FavoritesPage/FavoritesPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <UserPostsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:userId"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <UserAccountPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/post/:postId"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <PostDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
