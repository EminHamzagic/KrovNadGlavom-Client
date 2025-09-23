import { useContext } from "react";
import type { ReactNode } from "react";
import { UserContext } from "../../context/UserContext";

interface RequireRoleProps {
  roles: string[];
  children: ReactNode;
}

export function RequireRole({ roles, children }: RequireRoleProps) {
  const { getUserType } = useContext(UserContext);

  const userRole = getUserType();

  if (roles.includes(userRole)) {
    return <>{children}</>;
  }
  return null;
}
