import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";

const FavoritesPostsButton: React.FC = () => {
  return (
    <Link to="/favorites" className="favorites-posts-button">
      ⭐ Favorite Posts
    </Link>
  );
};

export default FavoritesPostsButton;