import { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Header from "./Header";
import Sidebar from "./Sidebar";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { darkMode } = useContext(AppContext);

  return (
    <div className="flex h-screen bg-[var(--color-bg-primary)]">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
        <footer className="py-4 px-6 border-t border-[var(--color-border-primary)] text-center text-[var(--color-text-secondary)] text-sm">
          <p>© {new Date().getFullYear()} Spectrum Hope NGO - Admin Dashboard</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;