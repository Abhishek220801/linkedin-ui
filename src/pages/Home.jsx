import Navbar from "../shared/Navbar"
import avatar from "../assets/avatar.png"
import { FaCamera, FaPen, FaPlus } from "react-icons/fa"
import useAuthStore from "../../store/store"
import EditProfile from "../shared/EditProfile"
import { useShallow } from "zustand/shallow"
import cover from "../assets/cover.png"
import { useEffect, useState } from "react"
import CreatePostModal from "../shared/CreatePostModal"
import httpInterceptor from "../utils/httpInterceptor"
import usePostStore from "../../store/usePostStore"
import Post from "./Post"

const Home = () => {
  const user = useAuthStore((state) => state.user)

  const [edit, setEdit] = useAuthStore(
    useShallow((state) => [state.edit, state.setEdit]),
  )

  const posts = usePostStore((state) => state.posts)
  const setPosts = usePostStore((state) => state.setPosts)
  const updatePost = usePostStore(state => state.updatePost)

  const [openPostModal, setOpenPostModal] = useState(false)
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      const { data } = await httpInterceptor.get("/api/post")
      setPosts(data.posts)
    } catch (err) {
      console.dir(err)
    }
  }

  const likePost = async (postId) => {
    try {
      setLoading(true);
      const { data } = await httpInterceptor.post(`/api/post/${postId}/like`)
      updatePost(postId, { liked: data.liked, likeCount: data.likeCount })
    } catch (err) {
      console.dir(err)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [updatePost, setPosts])

  return (
    <div className="min-h-screen w-full bg-[#f3f2ef]">
      {/* =========================================
          NAVBAR
      ========================================= */}
      <Navbar />

      {/* =========================================
          MAIN PAGE CONTAINER
          
          IMPORTANT:
          max-w-[1200px] prevents the entire UI
          from becoming excessively wide.
      ========================================= */}
      <main
        className="
          mx-auto
          flex
          w-full
          max-w-300
          flex-col
          gap-4
          px-3
          pb-10
          pt-20

          lg:grid
          lg:grid-cols-[220px_minmax(0,640px)]

          xl:grid-cols-[220px_minmax(0,640px)_280px]
          xl:gap-5
        "
      >
        {/* =========================================
            LEFT SIDEBAR / PROFILE
        ========================================= */}
        <aside className="w-full lg:w-55">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Cover */}
            <div className="relative">
              <img
                src={user?.coverImage || cover}
                alt="Cover"
                className="
                  h-24
                  w-full
                  object-cover
                  bg-gray-300

                  sm:h-28
                "
              />

              {/* Cover edit */}
              <button
                type="button"
                className="
                  absolute
                  right-3
                  top-3
                  z-10
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-white/90
                  text-gray-600
                  shadow-sm
                  transition
                  hover:bg-white
                  hover:text-gray-900
                  cursor-pointer
                "
                aria-label="Change cover photo"
                onClick={() => setEdit(true)}
              >
                <FaCamera size={13} />
              </button>
            </div>

            {/* Profile information */}
            <div className="relative px-4 pb-4">
              {/* Profile picture */}
              <div className="relative -mt-9 mb-3 w-fit">
                <img
                  src={user?.profileImage || avatar}
                  alt="Your profile"
                  className="
                    h-18
                    w-18
                    rounded-full
                    border-4
                    border-white
                    object-cover
                    shadow-sm
                  "
                />

                {/* Add profile image */}
                <button
                  type="button"
                  className="
                    absolute
                    bottom-0
                    right-0
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-white
                    bg-[#0a66c2]
                    text-white
                    shadow-sm
                    transition
                    cursor-pointer
                    hover:bg-[#004182]
                  "
                  aria-label="Add profile photo"
                  onClick={() => setEdit(true)}
                >
                  <FaPlus size={8} />
                </button>
              </div>

              {/* Name */}
              <h2
                className="
                  text-[17px]
                  font-semibold
                  leading-tight
                  text-gray-900
                "
              >
                {user?.firstName} {user?.lastName}
              </h2>

              {/* Headline */}
              <p
                className="
                  mt-1
                  text-[12px]
                  leading-snug
                  text-gray-600
                "
              >
                {user?.headline || "Add a headline"}
              </p>

              {/* Location */}
              {user?.location && (
                <p
                  className="
                    mt-1.5
                    text-[11px]
                    text-gray-400
                  "
                >
                  {user.location}
                </p>
              )}

              {/* Edit profile */}
              <button
                type="button"
                onClick={() => setEdit(true)}
                className="
                  mt-4
                  flex
                  h-9
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-[#0a66c2]
                  text-[13px]
                  font-medium
                  text-[#0a66c2]
                  transition
                  hover:bg-[#0a66c2]/5
                "
              >
                Edit Profile
                <FaPen size={11} />
              </button>
            </div>
          </div>
        </aside>

        {/* =========================================
            CENTER / MAIN FEED
          
            THIS IS THE IMPORTANT PART.

            max-width = 640px

            The feed will NEVER stretch to 50%
            of a huge monitor.
        ========================================= */}
        <section className="w-full min-w-0 space-y-4">
          {/* =======================================
              CREATE POST
          ======================================= */}
          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              p-3
              shadow-sm

              sm:p-4
            "
          >
            {/* Top row */}
            <div className="flex items-center gap-3">
              <img
                src={user?.profileImage || avatar}
                alt="Profile"
                className="
                  h-10
                  w-10
                  shrink-0
                  rounded-full
                  object-cover

                  sm:h-11
                  sm:w-11
                "
              />

              <button
                type="button"
                onClick={() => setOpenPostModal(true)}
                className="
                  flex
                  h-10
                  min-w-0
                  flex-1
                  items-center
                  rounded-full
                  border
                  border-gray-300
                  px-4
                  text-left
                  text-sm
                  text-gray-500
                  transition
                  hover:border-gray-400
                  hover:bg-gray-50

                  sm:h-11
                "
              >
                Start a post
              </button>
            </div>

            {/* Post options */}
            <div
              className="
                mt-2
                grid
                grid-cols-3
                gap-1

                sm:mt-3
              "
            >
              {/* Photo */}
              <button
                type="button"
                onClick={() => setOpenPostModal(true)}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  px-2
                  py-2
                  text-xs
                  font-medium
                  text-gray-600
                  transition
                  hover:bg-gray-100
                  sm:text-sm
                "
              >
                <FaCamera className="text-sky-500" />
                Photo
              </button>

              {/* Video */}
              <button
                type="button"
                onClick={() => setOpenPostModal(true)}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  px-2
                  py-2
                  text-xs
                  font-medium
                  text-gray-600
                  transition
                  hover:bg-gray-100

                  sm:text-sm
                "
              >
                <span className="text-green-500">▶</span>
                Video
              </button>

              {/* Write */}
              <button
                type="button"
                onClick={() => setOpenPostModal(true)}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  px-2
                  py-2
                  text-xs
                  font-medium
                  text-gray-600
                  transition
                  hover:bg-gray-100

                  sm:text-sm
                "
              >
                <FaPen className="text-orange-500" />
                Write
              </button>
            </div>
          </div>

          {/* =======================================
              POSTS
          ======================================= */}
          {posts?.map((post, _index) => (
            <Post key={post._id} post={post} like={() => likePost(post._id)} loading={loading}/>
          ))}
        </section>

        <aside className="hidden xl:block">
          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              p-4
              shadow-sm
            "
          >
            <h3
              className="
                text-sm
                font-semibold
                text-gray-900
              "
            >
              {/* LinkedIn Clone */}
              Right Div
            </h3>

            <p
              className="
                mt-2
                text-xs
                leading-5
                text-gray-500
              "
            >
              Discover people, follow interesting content and grow your
              professional network.
            </p>
          </div>
        </aside>
      </main>

      {edit && <EditProfile />}

      <CreatePostModal
        open={openPostModal}
        setOpen={setOpenPostModal}
        user={user}
      />
    </div>
  )
}

export default Home
