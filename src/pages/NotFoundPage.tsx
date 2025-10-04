import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router";

export default function NotFoundPage() {
  const { user } = useContext(UserContext);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page Not Found</p>
      <Link
        to={user.role === "Manager" ? "/buildings" : "/apartments"}
        className="mt-6 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark-light transition"
      >
        Go Home
      </Link>
    </div>
  );
}
