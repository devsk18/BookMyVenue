import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import keycloak from "../configs/keycloak";

export default function Layout() {
  const fullname = keycloak.tokenParsed?.name;
  const email = keycloak.tokenParsed?.email;
  return (
    <div className="flex bg-gray-50 min-h-screen font-sans text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col max-w-full">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-800"></h1>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 capitalize">{fullname}</p>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold border border-indigo-200 cursor-pointer">
              {fullname?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
