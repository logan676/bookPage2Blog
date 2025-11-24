import React from 'react';
import { CURRENT_USER_AVATAR } from '../constants';

interface HeaderProps {
    toggleTheme: () => void;
    isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode }) => {
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#dee2e6] dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-3 bg-white dark:bg-background-dark sticky top-0 z-40">
            <div className="flex items-center gap-4 text-[#111418] dark:text-white">
                <span className="material-symbols-outlined text-primary text-3xl select-none">import_contacts</span>
                <h2 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">BookPage Blog</h2>
            </div>
            <div className="flex flex-1 justify-end items-center gap-6">
                <nav className="hidden md:flex items-center gap-9">
                    <a className="text-[#111418] dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors" href="#">Home</a>
                    <a className="text-[#111418] dark:text-gray-300 text-sm font-medium leading-normal hover:text-primary dark:hover:text-primary transition-colors" href="#">New Post</a>
                </nav>
                <div className="flex items-center gap-2">
                     <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center rounded-full h-10 w-10 bg-background-light dark:bg-gray-700 text-[#111418] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        <span className="material-symbols-outlined text-xl">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                    </button>
                    <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-background-light dark:bg-gray-700 text-[#111418] dark:text-gray-300 gap-2 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <span className="material-symbols-outlined text-xl">notifications</span>
                    </button>
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-transparent hover:ring-primary/50 transition-all cursor-pointer"
                        style={{ backgroundImage: `url("${CURRENT_USER_AVATAR}")` }}
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;