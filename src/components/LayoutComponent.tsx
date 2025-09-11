import { Outlet } from "react-router";
import Header from "./Header";

export default function LayoutComponent() {
  return (
    <div className="h-screen grid grid-cols-12">
      <Header />

      <main className="col-span-10 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
