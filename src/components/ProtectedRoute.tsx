import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { UserContext } from "../context/UserContext";
import Cookies from "js-cookie";
import FullScreenLoader from "./FullScreenLoader";

export default function ProtectedRoute() {
  const { tokens, setLoginData } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = Cookies.get("accessToken");
    const storedRefreshToken = Cookies.get("refreshToken");
    const storedUser = Cookies.get("user");

    if (storedToken && storedRefreshToken && storedUser) {
      try {
        setLoginData(storedToken, storedRefreshToken, JSON.parse(storedUser));
      }
      catch {
        Cookies.remove("user");
      }
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!tokens.accessToken || tokens.accessToken.trim() === "") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
