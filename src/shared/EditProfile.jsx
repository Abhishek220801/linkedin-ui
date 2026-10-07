import { XIcon } from "lucide-react"
import useAuthStore from "../../store/store"

const EditProfile = () => {
  const setEdit = useAuthStore((state) => state.setEdit);
  return (
    <div className="w-full h-screen fixed top-0 z-100 flex justify-center items-center">
        <div className="w-full h-full bg-black opacity-[0.5] absolute"></div>
      <div className="w-[90%] max-w-125 h-135 bg-white absolute z-200 shadow-lg rounded-md">
        <div className="absolute top-2 right-2"><XIcon onClick={() => setEdit(false)} className="w-6.25 h-6.25 font-bold text-gray-800 cursor-pointer"/></div>
      </div>
    </div>
  )
}

export default EditProfile
