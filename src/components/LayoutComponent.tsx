import { Link, Outlet } from "react-router";
import Header from "./Header";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Menu } from "lucide-react";
import Breadcrumbs from "./Breadcrumbs";
import NotificationsComponent from "./NotificationsComponent";

export default function LayoutComponent() {
  const { user } = useContext(UserContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentYear = new Date().getFullYear();

  return (
    <div className="h-screen grid grid-cols-15 relative">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="col-span-15 md:col-span-11 lg:col-span-13 bg-gray-100 overflow-y-auto relative flex flex-col">
        <div className="bg-white flex justify-between items-center p-2 px-6 shadow">
          <button
            className="md:hidden p-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="ml-auto flex items-center">
            <NotificationsComponent />
            <Link to="/profile">
              <img
                className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 transition"
                src={
                  user.imageUrl
                  ?? "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"
                }
                alt="avatar"
              />
            </Link>
          </div>
        </div>
        <div className="p-6 flex-1">
          <Breadcrumbs />
          <Outlet />
        </div>
        <div className="w-full flex justify-center text-gray-500 p-6 mt-auto">
          <p className="text-center">
            ©
            {currentYear}
            . Emin Hamzagić, Medžid Jašarović - rights reservers.
          </p>
        </div>
      </main>
    </div>
  );
}
