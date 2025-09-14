import { Outlet } from "react-router";
import Header from "./Header";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Menu } from "lucide-react";

export default function LayoutComponent() {
  const { user } = useContext(UserContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen grid grid-cols-15 relative">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="col-span-15 md:col-span-11 lg:col-span-13 bg-gray-100 overflow-y-auto">
        <div className="bg-white flex justify-between items-center p-2 px-6 shadow">
          <button
            className="md:hidden p-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <img
            className="w-12 h-12 rounded-full ml-auto"
            src={
              user.imageUrl
              ?? "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"
            }
            alt="avatar"
          />
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
