import Navbar from "../shared/Navbar"
import avatar from "../assets/avatar.png"
import { FaCamera, FaPen, FaPlus } from "react-icons/fa"
import useAuthStore from "../../store/store"
import EditProfile from "../shared/EditProfile"
import { useShallow } from 'zustand/shallow';

const Home = () => {
  const user = useAuthStore((state) => state.user)
  const [edit, setEdit] = useAuthStore(useShallow((state) => [state.edit, state.setEdit]))

  return (
    <div className="w-full min-h-screen bg-[#f3f2e2] pt-20 flex flex-col items-start justify-center gap-5 px-5 lg:flex-row">
      {edit && <EditProfile/>}
      <Navbar />
      <div className="relative w-full lg:w-[25%] bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="relative h-28 w-full bg-gray-300 overflow-hidden">
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
          >
            <FaCamera size={14} />
          </button>

          <img src="" alt="Cover" className="h-full w-full object-cover" />
        </div>

        <div className="relative px-5 pb-5">
          <div className="relative -mt-9 mb-3 w-fit">
            <img
              src={avatar}
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
        "
              aria-label="Add profile photo"
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
            Edit Profile <FaPen/>
          </button>
        </div>
      </div>
      <div className="w-full lg:w-[50%] min-h-screen bg-white shadow-lg"></div>
      <div className="w-full lg:w-[25%] min-h-50 bg-white shadow-lg"></div>
    </div>
  )
}

export default Home
