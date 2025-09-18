import { useLocation, useNavigate } from "react-router";
import logo from "/KrovNadGlavomLogo.png";
import { Building, Building2, LayoutDashboard, LogOut, MessageSquarePlus, Percent, X } from "lucide-react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Header({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (val: boolean) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(UserContext);

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

            <button
              onClick={() => {
                navigate("/dashboard");
                setSidebarOpen(false);
              }}
              className={`${baseClasses} ${
                isActive("/dashboard") ? "bg-gray-200" : "hover:bg-gray-200"
              }`}
            >
              <LayoutDashboard />
              <span className="ml-2">Kontrolna tabla</span>
            </button>

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
            <button
              onClick={() => {
                navigate("/company");
                setSidebarOpen(false);
              }}
              className={`${baseClasses} ${
                isActive("/company") ? "bg-gray-200" : "hover:bg-gray-200"
              }`}
            >
              <Building2 />
              <span className="ml-2">Kompanija</span>
            </button>
            <button
              onClick={() => {
                navigate("/agency-requests");
                setSidebarOpen(false);
              }}
              className={`${baseClasses} ${
                isActive("/agency-requests") ? "bg-gray-200" : "hover:bg-gray-200"
              }`}
            >
              <MessageSquarePlus />
              <span className="ml-2">Zahtevi agencija</span>
            </button>
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
          </div>
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
    </>
  );
}
