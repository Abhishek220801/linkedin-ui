import Navbar from "../shared/Navbar"
import avatar from "../assets/avatar.png"
import { FaCamera, FaPen, FaPlus } from "react-icons/fa"
import useAuthStore from "../../store/store"
import EditProfile from "../shared/EditProfile"
import { useShallow } from "zustand/shallow"
import cover from "../assets/cover.png"
import { useEffect } from "react"
import { Modal } from "antd"
import CreatePostModal from "../shared/CreatePostModal"
import { useState } from "react"

const Home = () => {
  const [user, setUser] = useAuthStore(
    useShallow((state) => [state.user, state.setUser]),
  )
  const [edit, setEdit] = useAuthStore(
    useShallow((state) => [state.edit, state.setEdit]),
  )

  const [openPostModal, setOpenPostModal] = useState(false)

  useEffect(() => {
    setUser(user)
  }, [user])

  return (
    <div className="w-full min-h-screen bg-[#f3f2e2] pt-20 flex flex-col items-start justify-center gap-5 px-5 lg:flex-row">
      {edit && <EditProfile />}
      <Navbar />
      {/* LEFT */}
      <div className="relative w-full lg:w-[25%] bg-white shadow-lg rounded-lg overflow-hidden">
        <img
          src={user.coverImage || cover}
          className="relative h-28 w-full bg-gray-300 overflow-hidden"
        />
        <button
          type="button"
          className="
        absolute right-3 top-3 z-10
        flex h-8 w-8 items-center justify-center
        rounded-full bg-white/90
        text-gray-600
        shadow-sm
        transition-all
        hover:bg-white hover:text-gray-900
      "
          aria-label="Change cover photo"
          onClick={() => setEdit(true)}
        >
          <FaCamera size={14} />
        </button>

        <div className="relative px-5 pb-5">
          <div className="relative -mt-9 mb-3 w-fit">
            <img
              src={user.profileImage || avatar}
              alt="Your profile"
              className="
          h-18 w-18
          rounded-full
          border-4 border-white
          object-cover
          shadow-sm
        "
            />

            <button
              type="button"
              className="
          absolute bottom-0 right-0
          flex h-5 w-5
          items-center justify-center
          rounded-full
          border-2 border-white
          bg-[#1a84ee]
          text-white
          shadow-sm
          transition-all
          hover:bg-[#0966c2]
          outline-none
        "
              aria-label="Add profile photo"
              onClick={() => setEdit(true)}
            >
              <FaPlus size={9} />
            </button>
          </div>

          <h2 className="text-[18px] font-semibold leading-tight text-gray-800">
            {user?.firstName} {user?.lastName}
          </h2>

          <p className="mt-1 text-[13px] leading-snug text-gray-600">
            {user?.headline || "Add a headline"}
          </p>

          {user?.location && (
            <p className="mt-1.5 text-[12px] text-gray-400">{user.location}</p>
          )}

          <button
            type="button"
            className="
        mt-4
        h-9
        w-full
        rounded-full
        border-2 border-[#2dc0ff]
        text-[14px]
        font-medium
        text-[#2dc0ff]
        transition-all
        hover:bg-[#2dc0ff]/5
        flex items-center justify-center gap-2 cursor-pointer
      "
            onClick={() => setEdit(true)}
          >
            Edit Profile <FaPen />
          </button>
        </div>
      </div>

      {/* CENTER */}
      <div className="w-full lg:w-[50%] space-y-4">
        {/* ================= CREATE POST ================= */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={user?.profileImage || avatar}
              alt="Profile"
              className="h-11 w-11 rounded-full object-cover"
            />

            <button
              type="button"
              onClick={() => setOpenPostModal(true)}
              className="
          flex h-11 flex-1 items-center
          rounded-full
          border border-gray-300
          px-4
          text-left
          text-sm
          text-gray-500
          transition
          hover:bg-gray-50
          hover:border-gray-400
        "
            >
              Start a post
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between px-1">
            <button
              type="button"
              onClick={() => setOpenPostModal(true)}
              className="
          flex items-center gap-2
          rounded-lg px-3 py-2
          text-sm font-medium text-gray-600
          transition
          hover:bg-gray-100
        "
            >
              <FaCamera className="text-sky-500" />
              Photo
            </button>

            <button
              type="button"
              onClick={() => setOpenPostModal(true)}
              className="
          flex items-center gap-2
          rounded-lg px-3 py-2
          text-sm font-medium text-gray-600
          transition
          hover:bg-gray-100
        "
            >
              <span className="text-green-500">▶</span>
              Video
            </button>

            <button
              type="button"
              onClick={() => setOpenPostModal(true)}
              className="
          flex items-center gap-2
          rounded-lg px-3 py-2
          text-sm font-medium text-gray-600
          transition
          hover:bg-gray-100
        "
            >
              <FaPen className="text-orange-500" />
              Write
            </button>
          </div>
        </div>

        {/* ================= POST 1 ================= */}
        <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Post header */}
          <div className="flex items-start justify-between p-4">
            <div className="flex gap-3">
              <img
                src={avatar}
                alt="User"
                className="h-11 w-11 rounded-full object-cover"
              />

              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Ayush Sahu
                </h3>

                <p className="mt-0.5 text-xs text-gray-500">
                  Software Engineer · Full Stack Developer
                </p>

                <p className="mt-1 text-[11px] text-gray-400">2h · 🌐</p>
              </div>
            </div>

            <button
              className="
          rounded-full p-2
          text-gray-400
          transition
          hover:bg-gray-100
          hover:text-gray-700
        "
            >
              •••
            </button>
          </div>

          {/* Post content */}
          <div className="px-4 pb-3">
            <p className="whitespace-pre-line text-sm leading-6 text-gray-800">
              Just finished working on a new feature for my project. Really
              enjoying the process of building scalable applications and
              learning something new every day. 🚀 What's something you're
              currently building?
            </p>
          </div>

          {/* Optional image */}
          <div className="overflow-hidden border-y border-gray-100">
            <img
              src={cover}
              alt="Post"
              className="max-h-[480px] w-full object-cover"
            />
          </div>

          {/* Engagement count */}
          <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span
                className="
          flex h-5 w-5 items-center justify-center
          rounded-full bg-sky-500 text-[10px] text-white
        "
              >
                👍
              </span>

              <span>42 reactions</span>
            </div>

            <div className="flex gap-3">
              <span>8 comments</span>
              <span>3 reposts</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mx-4 border-t border-gray-100">
            <div className="grid grid-cols-4">
              <button
                className="
            flex items-center justify-center gap-2
            py-3
            text-xs font-medium text-gray-600
            transition
            hover:bg-gray-50
          "
              >
                👍 Like
              </button>

              <button
                className="
            flex items-center justify-center gap-2
            py-3
            text-xs font-medium text-gray-600
            transition
            hover:bg-gray-50
          "
              >
                💬 Comment
              </button>

              <button
                className="
            flex items-center justify-center gap-2
            py-3
            text-xs font-medium text-gray-600
            transition
            hover:bg-gray-50
          "
              >
                ↗ Repost
              </button>

              <button
                className="
            flex items-center justify-center gap-2
            py-3
            text-xs font-medium text-gray-600
            transition
            hover:bg-gray-50
          "
              >
                ✈ Send
              </button>
            </div>
          </div>
        </article>

        {/* ================= POST 2 ================= */}
        <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-start justify-between p-4">
            <div className="flex gap-3">
              <img
                src={avatar}
                alt="User"
                className="h-11 w-11 rounded-full object-cover"
              />

              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Rahul Sharma
                </h3>

                <p className="mt-0.5 text-xs text-gray-500">
                  Senior Software Engineer
                </p>

                <p className="mt-1 text-[11px] text-gray-400">5h · 🌐</p>
              </div>
            </div>

            <button
              className="
          rounded-full p-2
          text-gray-400
          hover:bg-gray-100
        "
            >
              •••
            </button>
          </div>

          <div className="px-4 pb-4">
            <p className="text-sm leading-6 text-gray-800">
              The best way to learn software engineering isn't just watching
              tutorials.
              <br />
              <br />
              Build something. Break it. Debug it. Ship it. Then do it again. 💻
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 px-4">
            <button className="flex flex-1 items-center justify-center gap-2 py-3 text-xs font-medium text-gray-600 hover:bg-gray-50">
              👍 Like
            </button>

            <button className="flex flex-1 items-center justify-center gap-2 py-3 text-xs font-medium text-gray-600 hover:bg-gray-50">
              💬 Comment
            </button>

            <button className="flex flex-1 items-center justify-center gap-2 py-3 text-xs font-medium text-gray-600 hover:bg-gray-50">
              ↗ Repost
            </button>

            <button className="flex flex-1 items-center justify-center gap-2 py-3 text-xs font-medium text-gray-600 hover:bg-gray-50">
              ✈ Send
            </button>
          </div>
        </article>
      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-[25%] min-h-50 bg-white shadow-lg"></div>
      <div className="m-20 absolute">
        <CreatePostModal
          open={openPostModal}
          setOpen={setOpenPostModal}
          user={user}
        />
      </div>
    </div>
  )
}

export default Home
