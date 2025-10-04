import { ChevronRight, Home } from "lucide-react";
import { Link, matchPath, useLocation } from "react-router";
import { breadcrumbConfig } from "../utils/breadcrumbConfig";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);
  const { user } = useContext(UserContext);

  const crumbs = pathnames.map((_, index) => {
    return `/${pathnames.slice(0, index + 1).join("/")}`;
  });

  return (
    <nav className="flex items-center text-md text-gray-600 space-x-2 mb-6">
      <Link to={user.role === "Manager" ? "/buildings" : "/apartments"} className="flex items-center hover:underline">
        <Home size={16} />
        {" "}
      </Link>

      {crumbs.map((path, index) => {
        const isLast = index === crumbs.length - 1;

        const matchPattern = Object.keys(breadcrumbConfig).find(pattern =>
          matchPath({ path: pattern, end: true }, path),
        );

        if (!matchPattern && !isLast)
          return null;

        const label = matchPattern ? breadcrumbConfig[matchPattern].label : "Detalji";

        return (
          <div key={path} className="flex items-center space-x-2">
            <ChevronRight size={14} className="text-gray-400" />
            {isLast
              ? (
                  <span className="font-medium">{label}</span>
                )
              : (
                  <Link to={path} className="hover:underline">
                    {label}
                  </Link>
                )}
          </div>
        );
      })}
    </nav>
  );
}
