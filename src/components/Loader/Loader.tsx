import React from "react";
import "./index.scss";

const Loader: React.FC = () => {
  return (
    <div className="loader">
      <div className="loader__spinner"></div>
      <p className="loader__message">Loading ...</p>
    </div>
  );
};

export default Loader;
