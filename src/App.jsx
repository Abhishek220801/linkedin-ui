import { Route, Routes } from "react-router"
import Home from "./pages/Home"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import VerifyEmail from "./pages/VerifyEmail"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/api/auth/verify-email" element={<VerifyEmail/>} />
    </Routes>
  )
}

export default App
