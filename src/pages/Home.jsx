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
import httpInterceptor from "../utils/httpInterceptor"
import usePostStore from "../../store/usePostStore"
import Post from "./Post"

const Home = () => {
  const [user, setUser] = useAuthStore(
    useShallow((state) => [state.user, state.setUser]),
  )
  const [edit, setEdit] = useAuthStore(
    useShallow((state) => [state.edit, state.setEdit]),
  )

  const [posts, setPosts] = usePostStore(useShallow((state) => [state.posts, state.setPosts]));

  const [openPostModal, setOpenPostModal] = useState(false)

  const fetchPosts = async () => {
    try {
      const {data} = await httpInterceptor.get("/api/post");
      setPosts(data.posts)
      console.log(data.posts);
    } catch (err) {
      console.dir(err);
      throw err;
    }
  }

  useEffect(() => {
    fetchPosts();
  }, [])

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
        {posts.map(p => <Post post={p}/>)}

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
