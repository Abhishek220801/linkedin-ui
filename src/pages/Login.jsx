import { useState } from "react"
import logo from "../assets/logo.svg"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router"
import useCredentialsStore from "../../store/store";

// const validateInput = (item) => {

// }

const Login = () => {

  const emailReceived = useCredentialsStore((state) => state.credentials.email);

  const [inputErr, setInputErr] = useState({
    email: "",
    password: ""
  })

  const [inputEl, setInputEl] = useState({
    email: "",
    password: ""
  })

  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const input = e.target;
    const key = input.name;
    const val = input.value;

    setInputEl({
      ...inputEl,
      [key]: val
    })
  }
  return (
    <div className="w-full h-screen bg-[white] flex flex-col items-center justify-start gap-2.5">
      <div className="p-7.5 lg:p-8.75 w-full h-20 flex items-center">
        <img src={logo} alt="logo" className="w-25.5 h-7.5" />
      </div>
      <form className="w-[90%] max-w-100 h-150 md:shadow-xl flex flex-col justify-center gap-3 p-8">
        <h1 className="text-gray-800 text-[30px] font-semibold">Log In</h1>
        <label>Email or username</label>
        <input value={emailReceived} onChange={handleChange} name="email" type="text" required className="w-full h-12.5 border border-gray-400 text-gray-800 text-4.5 px-7 py-2.5 rounded-md focus:border-2 focus:border-[#0A66C2] focus:outline-none"/>
        <label></label>
          <label>Password</label>
        <div className="flex relative items-center">
          <input onChange={handleChange} name="password" type={show ? "text" : "password"} required className="w-full h-12.5 border border-gray-400 text-gray-800 text-4.5 px-7 py-2.5 rounded-md focus:border-2 focus:border-[#0A66C2] focus:outline-none" />
          <span className="absolute right-5 cursor-pointer text-gray-700" onClick={() => setShow(prev => !prev)}>
            {show ? <FaRegEyeSlash /> : <FaRegEye/> }
          </span>
        </div>
        <label></label>
          <button className="cursor-pointer rounded-3xl px-6 py-2 hover:bg-[#0b5eb1] bg-[#0A66C2] text-white mt-3 border-none" onClick={(e) => {
            e.preventDefault()
            console.log(inputEl);
          }}>Login</button>
          <p className="text-center">Don't have an account ? <span className="text-[#0A66C2] cursor-pointer hover:text-[#0b5eb1]" onClick={() => navigate("/signup")}>Sign up</span></p>
      </form>
    </div>
  )
}

export default Login
