import { useEffect, useRef, useState } from "react"
import {
  FaBell,
  FaHome,
  FaLinkedin,
  FaSearch,
  FaUserFriends,
} from "react-icons/fa"

import { useNavigate } from "react-router"

import avatar from "../assets/avatar.png"
import useAuthStore from "../../store/store"
import { Divider } from "antd"
import httpInterceptor from "../utils/httpInterceptor";
import { useShallow } from 'zustand/shallow';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSearch, setActiveSearch] = useState(false)

  const [user, setUser] = useAuthStore(useShallow((state) => [state.user, state.setUser]))

  const menuRef = useRef(null)
  const searchInputRef = useRef(null)

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        setActiveSearch(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  useEffect(() => {
    if (activeSearch) {
      searchInputRef.current?.focus()
    }
  }, [activeSearch])

  const logout = async () => {
    try {
      await httpInterceptor.post("/api/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <nav className="fixed top-0 left-0 z-50 h-14 w-full bg-white shadow-sm">
      <div className="mx-auto flex h-full w-full items-center justify-between px-4 sm:px-5 md:px-8 lg:px-10 xl:px-16 2xl:px-20">
        {/* =====================================================
            LEFT SECTION
        ====================================================== */}
        <div className="flex min-w-0 flex-1 items-center">
          {/* =================================================
              MOBILE ACTIVE SEARCH
          ================================================== */}
          {activeSearch ? (
            <div className="flex w-full items-center gap-2 sm:hidden">
              <form
                className="relative min-w-0 flex-1"
                onSubmit={(event) => event.preventDefault()}
              >
                <FaSearch
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  className="
                    h-9
                    w-full
                    rounded-md
                    border
                    border-gray-300
                    bg-gray-100
                    pl-9
                    pr-3
                    text-sm
                    text-gray-900
                    outline-none
                    transition-all
                    placeholder:text-gray-500
                    focus:border-gray-400
                    focus:bg-white
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />
              </form>

              {/* Close search */}
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setActiveSearch(false)}
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-md
                  text-xl
                  leading-none
                  text-gray-500
                  transition-colors
                  hover:bg-gray-100
                  hover:text-black
                "
              >
                ×
              </button>
            </div>
          ) : (
            <>
              {/* LinkedIn Logo */}
              <button
                type="button"
                aria-label="LinkedIn home"
                className="
                  flex
                  shrink-0
                  items-center
                  justify-center
                  rounded-sm
                  transition-opacity
                  hover:opacity-80
                "
              >
                <FaLinkedin size={38} color="#0A66C2" />
              </button>

              {/* Mobile Search Button */}
              <button
                type="button"
                aria-label="Open search"
                onClick={() => setActiveSearch(true)}
                className="
                  ml-2
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-md
                  text-gray-600
                  transition-colors
                  hover:bg-gray-100
                  hover:text-black
                  sm:hidden
                "
              >
                <FaSearch size={17} />
              </button>
            </>
          )}

          {/* =================================================
              TABLET + DESKTOP SEARCH
          ================================================== */}
          <form
            className="
              relative
              ml-3
              hidden
              min-w-0
              sm:block
            "
            onSubmit={(event) => event.preventDefault()}
          >
            <FaSearch
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="search"
              placeholder="Search"
              aria-label="Search"
              className="
                h-9
                w-40
                rounded-md
                border
                border-transparent
                bg-gray-100
                pl-9
                pr-3
                text-sm
                text-gray-900
                outline-none
                transition-all
                placeholder:text-gray-500
                hover:bg-gray-200
                focus:border-gray-400
                focus:bg-white
                focus:ring-2
                focus:ring-blue-100
                md:w-56
                lg:w-64
                xl:w-80
              "
            />
          </form>
        </div>

        {/* =====================================================
            RIGHT SECTION
        ====================================================== */}
        <div
          className={`
            flex
            shrink-0
            items-center
            gap-2
            sm:gap-5
            md:gap-7
            lg:gap-8
            ${activeSearch ? "hidden sm:flex" : "flex"}
          `}
        >
          {/* =================================================
              HOME
              Desktop only
          ================================================== */}
          <button
            type="button"
            className="
              hidden
              cursor-pointer
              flex-col
              items-center
              justify-center
              gap-0.5
              text-gray-600
              transition-colors
              hover:text-black
              lg:flex
            "
          >
            <FaHome size={21} />

            <span className="text-[11px] leading-none">Home</span>
          </button>

          {/* =================================================
              MY NETWORK
              Desktop only
          ================================================== */}
          <button
            type="button"
            className="
              hidden
              cursor-pointer
              flex-col
              items-center
              justify-center
              gap-0.5
              whitespace-nowrap
              text-gray-600
              transition-colors
              hover:text-black
              lg:flex
            "
          >
            <FaUserFriends size={21} />

            <span className="text-[11px] leading-none">My Network</span>
          </button>

          {/* =================================================
              NOTIFICATIONS
              Tablet + Desktop
          ================================================== */}
          <button
            type="button"
            aria-label="Notifications"
            className="
              flex
              h-10
              w-10
              cursor-pointer
              items-center
              justify-center
              rounded-md
              text-gray-600
              transition-colors
              hover:bg-gray-100
              hover:text-black
              sm:flex
              lg:h-auto
              lg:w-auto
              lg:flex-col
              lg:gap-0.5
              lg:rounded-none
              lg:hover:bg-transparent
            "
          >
            <FaBell size={21} />

            <span className="hidden text-[11px] leading-none lg:block">
              Notifications
            </span>
          </button>

          {/* =================================================
              PROFILE / MENU
          ================================================== */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Open profile menu"
              aria-expanded={menuOpen}
              className="
                flex
                cursor-pointer
                flex-col
                items-center
                justify-center
                rounded-md
                text-gray-600
                transition-colors
                hover:text-black
                lg:gap-0.5
                lg:rounded-none
              "
            >
              <img
                src={avatar}
                alt="Your profile"
                className="
                  h-8
                  w-8
                  rounded-full
                  object-cover
                  ring-1
                  ring-gray-200
                "
              />

              <span className="hidden text-[11px] leading-none lg:block">
                Me
              </span>
            </button>

            {menuOpen && (
              <div
                className="
      absolute right-0 top-11
      w-64
      overflow-hidden
      rounded-lg
      border border-gray-200
      bg-white
      shadow-lg shadow-black/10
    "
              >
                {/* PROFILE HEADER */}
                <div className="flex flex-col items-center border-b border-gray-100 px-4 py-4">
                  <div className="h-[64px] w-[64px] overflow-hidden rounded-full">
                    <img
                      src={avatar}
                      alt="Your profile"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="mt-2.5 text-center">
                    <p className="text-[18px] font-semibold leading-tight text-gray-700">
                      {user?.firstName || "User"} {user?.lastName || ""}
                    </p>

                    {user?.userName && (
                      <p className="mt-1 text-[13px] leading-tight text-gray-500">
                        @{user.userName}
                      </p>
                    )}

                    {user?.email && (
                      <p className="mt-1 max-w-[210px] truncate text-[12px] leading-tight text-gray-400">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* VIEW PROFILE */}
                <div className="px-4 pt-3">
                  <button
                    type="button"
                    className="
          h-9 w-full
          rounded-full
          border-2 border-[#2dc0ff]
          text-[14px] font-medium
          text-[#2dc0ff]
          transition-all
          hover:bg-[#2dc0ff]/5
        "
                  >
                    View Profile
                  </button>
                </div>

                {/* DIVIDER */}
                <Divider className="!my-3 !border-gray-100" />

                {/* MY NETWORK */}
                <button
                  type="button"
                  className="
        flex w-full items-center gap-3
        px-4 py-2
        text-left
        text-[14px]
        text-gray-700
        transition-colors
        hover:bg-gray-50
      "
                  onClick={() => setMenuOpen(false)}
                >
                  <FaUserFriends size={20} className="shrink-0 text-gray-500" />

                  <span>My Network</span>
                </button>

                <div className="px-4 pb-3 pt-2">
                  <button
                    type="button"
                    className="
          h-9 w-full
          rounded-full
          border-2 border-[#ec4545]
          text-[14px] font-medium
          text-[#ec4545]
          transition-all
          hover:bg-[#ec4545]/5
        "
        onClick = {logout}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
