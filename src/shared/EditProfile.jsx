import { FaSkullCrossbones } from "react-icons/fa"
import { Cross, XIcon } from "lucide-react"

const EditProfile = () => {
  return (
    <div className="w-full h-screen fixed top-0 z-100 flex justify-center items-center">
        <div className="w-full h-full bg-black opacity-[0.5] absolute"></div>
      <div className="w-[90%] max-w-125 h-135 bg-white absolute z-200 shadow-lg rounded-md">
        <div className="fixed right-2"><XIcon/></div>
      </div>
    </div>
  )
}

export default EditProfile
