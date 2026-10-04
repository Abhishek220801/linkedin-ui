import { useEffect, useState } from "react"
import logo from "../assets/logo.svg"
import { FaRegEye, FaRegEyeSlash, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router"
import useCredentialsStore from "../../store/store";
import httpInterceptor from "../utils/httpInterceptor";
import {message} from "antd"
import clientError from "../utils/clientError";
import useAuthStore from "../../store/store";

const Login = () => {

  const [inputEl, setInputEl] = useState({
    email: "",
    password: ""
  })

  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const input = e.target;
    const key = input.name;
    const val = input.value;

    setInputEl({
      ...inputEl,
      [key]: val
    })
  }

  const login = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      const {data} = await httpInterceptor.post("/api/auth/login", inputEl)
      setUser(data.user);
      message.success("Login success")
      navigate("/");
    } catch (err) {
      setError(clientError(err));
    }
    finally{
      setLoading(false);
    }
  }

  useEffect(() => {
      if(!error) return;
      message.error(error);
    }, [error]);
  return (
    <div className="w-full h-screen bg-[white] flex flex-col items-center justify-start gap-2.5">
      <div className="p-7.5 lg:p-8.75 w-full h-20 flex items-center">
        <img src={logo} alt="logo" className="w-25.5 h-7.5" />
      </div>
      <form onSubmit={login} className="w-[90%] max-w-100 h-150 md:shadow-xl flex flex-col justify-center gap-3 p-8">
        <h1 className="text-gray-800 text-[30px] font-semibold">Log In</h1>
        <label>Email or username</label>
        <input onChange={handleChange} name="email" type="text" required className="w-full h-12.5 border border-gray-400 text-gray-800 text-4.5 px-7 py-2.5 rounded-md focus:border-2 focus:border-[#0A66C2] focus:outline-none"/>
          <label>Password</label>
        <div className="flex relative items-center">
          <input onChange={handleChange} name="password" type={show ? "text" : "password"} required className="w-full h-12.5 border border-gray-400 text-gray-800 text-4.5 px-7 py-2.5 rounded-md focus:border-2 focus:border-[#0A66C2] focus:outline-none" />
          <span className="absolute right-5 cursor-pointer text-gray-700" onClick={() => setShow(prev => !prev)}>
            {show ? <FaRegEyeSlash /> : <FaRegEye/> }
          </span>
        </div>
          <button disabled={loading} className="cursor-pointer rounded-3xl px-6 py-2 hover:bg-[#0b5eb1] bg-[#0A66C2] text-white mt-3 border-none flex items-center justify-center gap-1">
            <span className="animate-spin">{loading && <FaSpinner/>}</span>
            Login
          </button>
          <p className="text-center">Don't have an account ? <span className="text-[#0A66C2] cursor-pointer hover:text-[#0b5eb1]" onClick={() => navigate("/signup")}>Sign up</span></p>
      </form>
    </div>
  )
}

export default Login
