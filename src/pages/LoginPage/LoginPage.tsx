import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import {
  authorizationAdmin,
  authorizationUser,
} from "../../constants/authorizationInfo";
import "./index.scss";

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (
      username === authorizationAdmin.username &&
      password === authorizationAdmin.password
    ) {
      dispatch(login({ role: "admin" }));
      navigate("/admin-dashboard");
    } else if (
      username === authorizationUser.username &&
      password === authorizationUser.password
    ) {
      dispatch(login({ role: "user" }));
      navigate("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
