import { useRef, useState } from "react"
import logo from "../assets/logo.svg"
import { FaRegEye, FaRegEyeSlash, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router"
import httpInterceptor from "../utils/httpInterceptor";
import axios from "axios";
import useCredentialsStore from "../../store/store";
import {message} from "antd"
import { signupSchema } from "../utils/validateInput";
import clientError from "../utils/clientError";

// const validateInput = (item) => {

// }

const Signup = () => {
  const [inputErr, setInputErr] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: ""
  })

  const [inputEl, setInputEl] = useState({
    firstName: "Nesir",
    lastName: "Kamora",
    userName: "nesir_kamora",
    email: "nesirkamora@gmail.com",
    password: "Nesir@123"
  })

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const signupForm = useRef(null);
  const setEmail = useCredentialsStore((state) => state.setEmail);

  const handleChange = (e) => {
    const input = e.target;
    const key = input.name;
    const val = input.value;

    setInputEl({
      ...inputEl,
      [key]: val
    })
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const result = signupSchema.safeParse(inputEl);

      if(!result.success){
        console.log({error: result.error});
        return message.error(
          result.error.issues[0]?.message || "Invalid input"
        )
      }

      let {data} = await httpInterceptor.post("/api/auth/signup", result.data);
      message.success("User registered")
      setEmail(inputEl.email);
      console.log(data);
      signupForm.current.reset();
      navigate("/login");
    } catch (err) {
      console.dir(err);
      clientError(err);
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-screen bg-[white] flex flex-col items-center justify-start gap-2.5">
      <div className="p-7.5 lg:p-8.75 w-full h-20 flex items-center">
        <img src={logo} alt="logo" className="w-25.5 h-7.5" />
      </div>
      <form ref={signupForm} onSubmit={handleSignup} className="w-[90%] max-w-100 h-150 md:shadow-xl flex flex-col justify-center gap-4 p-8">
        <h1 className="text-gray-800 text-[30px] font-semibold">Sign Up</h1>
        <input value={inputEl.firstName} onChange={handleChange} name="firstName" type="text" placeholder="Firstname" required className="w-full h-12.5 border border-gray-400 text-gray-800 text-4.5 px-7 py-2.5 rounded-md focus:border-2 focus:border-[#0A66C2] focus:outline-none" />
        <input value={inputEl.lastName} onChange={handleChange} name="lastName" type="text" placeholder="Lastname" required className="w-full h-12.5 border border-gray-400 text-gray-800 text-4.5 px-7 py-2.5 rounded-md focus:border-2 focus:border-[#0A66C2] focus:outline-none" />
        <input value={inputEl.userName} onChange={handleChange} name="userName" type="text" placeholder="Username" required className="w-full h-12.5 border border-gray-400 text-gray-800 text-4.5 px-7 py-2.5 rounded-md focus:border-2 focus:border-[#0A66C2] focus:outline-none" />
        <input value={inputEl.email} onChange={handleChange} name="email" type="email" placeholder="Email" required className="w-full h-12.5 border border-gray-400 text-gray-800 text-4.5 px-7 py-2.5 rounded-md focus:border-2 focus:border-[#0A66C2] focus:outline-none" />
        <div className="flex relative items-center">
        <input value={inputEl.password} onChange={handleChange} name="password" type={show ? "text" : "password"} placeholder="Password (8+ characters)" required className="w-full h-12.5 border border-gray-400 text-gray-800 text-4.5 px-7 py-2.5 rounded-md focus:border-2 focus:border-[#0A66C2] focus:outline-none" />
        <span className="absolute right-5 cursor-pointer text-gray-700" onClick={() => setShow(prev => !prev)}>
          {show ? <FaRegEyeSlash /> : <FaRegEye/> }
        </span>
        </div>
          <button disabled={loading} className="flex items-center justify-center gap-2 cursor-pointer rounded-3xl px-6 py-2 hover:bg-[#0b5eb1] bg-[#0A66C2] text-white mt-3 border-none">
            <span className="animate-spin">{loading && <FaSpinner/>}</span>
            Sign Up
          </button>
          <p className="text-center">Already have an account ? <span className="text-[#0A66C2] cursor-pointer hover:text-[#0b5eb1]" onClick={() => navigate("/login")}>Sign In</span></p>
      </form>
    </div>
  )
}

export default Signup
