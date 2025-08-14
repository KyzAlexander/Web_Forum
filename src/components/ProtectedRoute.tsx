import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface IProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ("user" | "admin")[];
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, userRole } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated || !allowedRoles.includes(userRole!)) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
