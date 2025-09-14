import { useNavigate } from "react-router";
import logo from "/KrovNadGlavomLogo.png";
import { LogOut, X } from "lucide-react";
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
  const { logout } = useContext(UserContext);

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
          className="mx-auto h-20 w-auto mb-5"
        />
        <div className="flex flex-col justify-between h-full">
          <div>sad</div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center hover:bg-gray-200 p-3 cursor-pointer transition-all duration-200 rounded-md"
          >
            <LogOut color="red" />
            <span className="ml-2 text-red-700">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
