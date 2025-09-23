import { useContext } from "react";
import type { JSX } from "react";
import { UserContext } from "../../context/UserContext";
import { Navigate } from "react-router";

interface RequireRoleRouteProps {
  roles: string[];
  element: JSX.Element;
}

export function RequireRoleRoute({ roles, element }: RequireRoleRouteProps) {
  const { getUserType } = useContext(UserContext);

  const userRole = getUserType();

  if (roles.includes(userRole)) {
    return element;
  }

  return <Navigate to="/404" replace />;
}
