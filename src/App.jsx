import { Navigate, Route, Routes } from "react-router"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import VerifyEmail from "./pages/VerifyEmail"
import useAuthStore from "../store/store"
import { useEffect, useRef } from "react"
import httpInterceptor from "./utils/httpInterceptor"
import NotFound from "./pages/NotFound"

function App() {
  let user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  const userRef = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {data} = await httpInterceptor.get("/api/user/current-user");
        setUser(data);
      } catch (error) {
        clearUser();
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    setUser(user);
  }, [user])
  return (
    <Routes>
      <Route path="/" element={user ? <Home/> : <Navigate to="/login" />} />
      <Route path="/signup" element={user ? <Navigate to="/"/> : <Signup/>} />
      <Route path="/login" element={user ? <Navigate to="/"/> : <Login/>} />
      <Route path="/api/auth/verify-email" element={<VerifyEmail/>} />
      <Route path="*" element={<NotFound/>} />
    </Routes>
  )
}

export default App