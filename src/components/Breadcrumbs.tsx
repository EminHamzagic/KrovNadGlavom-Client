import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router";
import { breadcrumbConfig } from "../utils/breadcrumbConfig";

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  const crumbs = pathnames.map((_, index) => {
    const to = `/${pathnames.slice(0, index + 1).join("/")}`;
    return to;
  });
  return (
    <nav className="flex items-center text-md text-gray-600 space-x-2 mb-6">
      <Link to="/dashboard" className="flex items-center hover:underline">
        <Home size={16} />
        {" "}
      </Link>

      {crumbs.map((path, index) => {
        const isLast = index === crumbs.length - 1;
        const config = breadcrumbConfig[path];

        return (
          <div key={path} className="flex items-center space-x-2">
            <ChevronRight size={14} className="text-gray-400" />
            {isLast
              ? (
                  <span className="font-medium">{config?.label ?? "Detalji"}</span>
                )
              : (
                  <Link to={path} className="hover:underline">
                    {config?.label ?? "Detalji"}
                  </Link>
                )}
          </div>
        );
      })}
    </nav>
  );
}
