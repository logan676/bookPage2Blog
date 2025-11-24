import React from 'react';
import { Menu, LayoutDashboard, PieChart, FileText, Plus } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 sm:px-6 lg:px-10">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black">
           <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5"
          >
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">BookPost</h1>
      </div>

      <div className="hidden md:flex flex-1 items-center justify-end gap-8">
        <nav className="flex items-center gap-6">
          <a
            href="#"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
          >
            <LayoutDashboard size={16} />
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
          >
            <FileText size={16} />
            My Posts
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors"
          >
            <PieChart size={16} />
            Analytics
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary-hover active:scale-95 shadow-sm">
            <Plus size={18} strokeWidth={3} />
            <span>New Post</span>
          </button>
          <div className="size-10 overflow-hidden rounded-full border-2 border-white shadow-sm dark:border-gray-700">
             <img
              src="https://picsum.photos/100/100"
              alt="User Profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>

      <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-gray-800">
        <Menu size={24} />
      </button>
    </header>
  );
};

export default Header;
