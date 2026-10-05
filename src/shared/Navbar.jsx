import { useState } from "react"
import {
  FaBell,
  FaHome,
  FaLinkedin,
  FaUserFriends,
} from "react-icons/fa"

import avatar from "../assets/avatar.png"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="w-full h-14 bg-white fixed top-0 left-0 z-50 shadow-sm flex items-center justify-between px-4 md:px-8 lg:px-12 xl:px-20">

      {/* ================= LEFT SECTION ================= */}
      <div className="flex items-center gap-3 min-w-0">

        {/* LinkedIn Logo */}
        <FaLinkedin
          size={38}
          color="#0A66C2"
          className="shrink-0"
        />

        {/* Search */}
        <form className="relative hidden sm:block">
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
            className="h-9 w-40 md:w-64 lg:w-80 rounded-md bg-gray-100 border border-transparent focus:border-gray-400 focus:bg-white focus:outline-none pl-9 pr-3 text-sm transition-all"
          />
        </form>
      </div>


      {/* ================= RIGHT SECTION ================= */}
      <div className="flex items-center gap-5 sm:gap-6 md:gap-8">

        {/* Home
            Visible only on large screens */}
        <div className="hidden lg:flex flex-col items-center text-gray-600 hover:text-black cursor-pointer">
          <FaHome size={22} />
          <span className="text-xs mt-1">Home</span>
        </div>


        {/* My Network
            Visible only on large screens */}
        <div className="hidden lg:flex flex-col items-center text-gray-600 hover:text-black cursor-pointer">
          <FaUserFriends size={22} />
          <span className="text-xs mt-1 whitespace-nowrap">
            My Network
          </span>
        </div>


        {/* Notifications
            Visible on medium + large screens
            Hidden on mobile */}
        <div className="hidden sm:flex flex-col items-center text-gray-600 hover:text-black cursor-pointer">
          <FaBell size={22} />

          <span className="text-xs mt-1 hidden lg:block">
            Notifications
          </span>
        </div>


        {/* ================= ME / MENU ================= */}
        <div className="relative">

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex flex-col items-center text-gray-600 hover:text-black cursor-pointer"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <img
              className="h-8 w-8 rounded-full object-cover"
              src={avatar}
              alt="user-avatar"
            />

            {/* "Me" label only on large screens */}
            <span className="text-xs mt-1 hidden lg:block">
              Me
            </span>
          </button>


          {/* ================= MOBILE MENU ================= */}
          {menuOpen && (
            <div className="absolute right-0 top-11 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 lg:hidden">

              {/* Home */}
              <div className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer">
                <FaHome size={18} />
                <span className="text-sm">Home</span>
              </div>

              {/* My Network */}
              <div className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer">
                <FaUserFriends size={18} />
                <span className="text-sm">My Network</span>
              </div>

              {/* Notifications */}
              <div className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 cursor-pointer">
                <FaBell size={18} />
                <span className="text-sm">Notifications</span>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default Navbar