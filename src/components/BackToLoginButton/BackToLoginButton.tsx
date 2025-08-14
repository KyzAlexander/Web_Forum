import React from "react";
import { Link } from "react-router-dom";
import "./index.scss";

const BackToLoginButton: React.FC = () => {
  return (
    <Link to="/login" className="back-to-login-button">
      Sign out
    </Link>
  );
};

export default BackToLoginButton;