import { FaBell, FaHome, FaLinkedin, FaUserFriends } from "react-icons/fa";

import avatar from "../assets/avatar.png";

const Navbar = () => {
  return (
    <div className="w-full h-14 bg-white fixed top-0 left-0 z-50 shadow-sm flex items-center justify-between px-4 md:px-8 lg:px-12 xl:px-20">
      
      {/* Left Section */}
      <div className="flex items-center gap-3 min-w-0">
        {/* LinkedIn Logo */}
        <FaLinkedin
          size={38}
          color="#0A66C2"
          className="shrink-0"
        />

        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="currentColor"
            aria-hidden="true"
            className="lg:hidden md:hidden absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          >
            <path d="M14.56 12.44 11.3 9.18a5.51 5.51 0 1 0-2.12 2.12l3.26 3.26a1.5 1.5 0 1 0 2.12-2.12M3 6.5A3.5 3.5 0 1 1 6.5 10 3.5 3.5 0 0 1 3 6.5" />
          </svg>

        {/* Search */}
        <form className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="16"
            height="16"
            fill="currentColor"
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          >
            <path d="M14.56 12.44 11.3 9.18a5.51 5.51 0 1 0-2.12 2.12l3.26 3.26a1.5 1.5 0 1 0 2.12-2.12M3 6.5A3.5 3.5 0 1 1 6.5 10 3.5 3.5 0 0 1 3 6.5" />
          </svg>

          <input
            type="text"
            placeholder="Search"
            className="h-9 w-40 hidden md:w-64 lg:w-80 rounded-md bg-gray-100 border border-transparent focus:border-gray-400 focus:bg-white focus:outline-none pl-9 pr-3 text-sm transition-all"
          />
        </form>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
        
        {/* Home */}
        <div className="flex flex-col items-center text-gray-600 hover:text-black cursor-pointer">
          <FaHome size={22} />
          <span className="text-xs mt-1 hidden sm:block">Home</span>
        </div>

        {/* My Network */}
        <div className="flex flex-col items-center text-gray-600 hover:text-black cursor-pointer">
          <FaUserFriends size={22} />
          <span className="text-xs mt-1 hidden sm:block whitespace-nowrap">
            My Network
          </span>
        </div>

        {/* Notifications */}
        <div className="flex flex-col items-center text-gray-600 hover:text-black cursor-pointer">
          <FaBell size={22} />
          <span className="text-xs mt-1 hidden sm:block">
            Notifications
          </span>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center text-gray-600 hover:text-black cursor-pointer">
          <img
            className="h-8 w-8 rounded-full object-cover"
            src={avatar}
            alt="user-avatar"
          />
          <span className="text-xs mt-1 hidden sm:block">Me</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;