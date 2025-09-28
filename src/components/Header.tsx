import { useLocation, useNavigate } from "react-router";
import logo from "/KrovNadGlavomLogo.png";
import { Bed, Bookmark, Building, Building2, FileUser, LogOut, MessageSquarePlus, Percent, X } from "lucide-react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { RequireRole } from "./Auth/RequireRole";

export default function Header({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useContext(UserContext);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const baseClasses
    = "flex items-center p-3 cursor-pointer transition-all duration-200 rounded-md w-full mb-1";

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
          flex flex-col bg-white text-black p-4 shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] 
          transition-transform duration-300 z-30
          
          /* Desktop */
          lg:static lg:col-span-2 lg:translate-x-0 lg:h-auto lg:w-full
          
          /* Desktop */
          md:static md:col-span-4 md:translate-x-0 md:h-auto md:w-full
          
          /* Mobile */
          fixed inset-y-0 left-0 w-64 h-full
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <button
          className="md:hidden self-end mb-4"
          onClick={() => setSidebarOpen(false)}
        >
          <X size={24} />
        </button>

        <img
          src={logo}
          alt="KrovNad Glavom"
          className="mx-auto h-20 w-auto mb-5 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        />
        <div className="flex flex-col justify-between h-full">
          <div>
            <RequireRole roles={["User"]}>
              <button
                onClick={() => {
                  navigate("/apartments");
                  setSidebarOpen(false);
                }}
                className={`${baseClasses} ${
                  isActive("/apartments") ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
              >
                <Bed />
                <span className="ml-2">Stanovi</span>
              </button>
              <button
                onClick={() => {
                  navigate("/agency");
                  setSidebarOpen(false);
                }}
                className={`${baseClasses} ${
                  isActive("/agency") ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
              >
                <Building2 />
                <span className="ml-2">Agencije</span>
              </button>
            </RequireRole>

            <RequireRole roles={["Company", "Agency"]}>
              <button
                onClick={() => {
                  navigate("/buildings");
                  setSidebarOpen(false);
                }}
                className={`${baseClasses} ${
                  isActive("/buildings") ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
              >
                <Building />
                <span className="ml-2">Zgrade</span>
              </button>
            </RequireRole>

            <RequireRole roles={["Company", "Agency"]}>
              <button
                onClick={() => {
                  navigate("/requests");
                  setSidebarOpen(false);
                }}
                className={`${baseClasses} ${
                  isActive("/requests") ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
              >
                <MessageSquarePlus />
                <span className="ml-2">Zahtevi</span>
              </button>
            </RequireRole>

            <button
              onClick={() => {
                navigate("/discount-requests");
                setSidebarOpen(false);
              }}
              className={`${baseClasses} ${
                isActive("/discount-requests") ? "bg-gray-200" : "hover:bg-gray-200"
              }`}
            >
              <Percent />
              <span className="ml-2">Zahtevi za popust</span>
            </button>

            <RequireRole roles={["User", "Agency"]}>
              <button
                onClick={() => {
                  navigate("/contracts");
                  setSidebarOpen(false);
                }}
                className={`${baseClasses} ${
                  isActive("/contracts") ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
              >
                <FileUser />
                <span className="ml-2">Ugovori</span>
              </button>
            </RequireRole>

            <RequireRole roles={["User"]}>
              <button
                onClick={() => {
                  navigate("/reservations");
                  setSidebarOpen(false);
                }}
                className={`${baseClasses} ${
                  isActive("/reservations") ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
              >
                <Bookmark />
                <span className="ml-2">Rezervacije</span>
              </button>
            </RequireRole>
          </div>

          <div>
            <RequireRole roles={["Company"]}>
              <button
                onClick={() => {
                  navigate(`/company/${user.constructionCompanyId}`);
                  setSidebarOpen(false);
                }}
                className={`${baseClasses} ${
                  isActive("/company") ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
              >
                <Building2 />
                <span className="ml-2">Kompanija</span>
              </button>
            </RequireRole>

            <RequireRole roles={["Agency"]}>
              <button
                onClick={() => {
                  navigate(`/agency/${user.agencyId}`);
                  setSidebarOpen(false);
                }}
                className={`${baseClasses} ${
                  isActive("/agency") ? "bg-gray-200" : "hover:bg-gray-200"
                }`}
              >
                <Building2 />
                <span className="ml-2">Agencija</span>
              </button>
            </RequireRole>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex items-center hover:bg-gray-200 p-3 cursor-pointer transition-all duration-200 rounded-md w-full"
            >
              <LogOut color="red" />
              <span className="ml-2 text-red-700">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
