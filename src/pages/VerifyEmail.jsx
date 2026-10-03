import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { FaCheckCircle, FaRegTimesCircle, FaSpinner } from "react-icons/fa"
import logo from "../assets/logo.svg"
import httpInterceptor from "../utils/httpInterceptor"

const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get("token")
  const [status, setStatus] = useState("loading")
  const [message, setMessage] = useState("Verifying your email address...")

  useEffect(() => {
    let active = true
    let redirectTimer

    const verifyEmail = async () => {
      if (!token) {
        setStatus("error")
        setMessage("The verification link is missing its token.")
        return
      }

      try {
        const { data } = await httpInterceptor.get("/api/auth/verify-email", {
          params: { token },
        })
        console.log(data);

        if (!active) return
        setStatus("success")
        setMessage(data?.message || "Your email has been verified successfully.")
        redirectTimer = setTimeout(() => navigate("/login"), 2000)
      } catch (error) {
        if (!active) return
        setStatus("error")
        setMessage(
          error.response?.data?.message ||
            "We couldn't verify your email. The link may be invalid or expired.",
        )
      }
    }

    verifyEmail()

    return () => {
      active = false
      clearTimeout(redirectTimer)
    }
  }, [token, navigate])

  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-white">
      <div className="flex h-20 w-full items-center p-7.5 lg:p-8.75">
        <img src={logo} alt="LinkedIn" className="h-7.5 w-25.5" />
      </div>

      <main className="flex w-[90%] max-w-100 flex-1 items-center justify-center pb-12">
        <section
          aria-live="polite"
          className="flex w-full flex-col items-center gap-4 p-8 text-center md:shadow-xl"
        >
          {status === "loading" && (
            <FaSpinner aria-hidden="true" className="animate-spin text-3xl text-[#0A66C2]" />
          )}
          {status === "success" && (
            <FaCheckCircle aria-hidden="true" className="text-3xl text-green-600" />
          )}
          {status === "error" && (
            <FaRegTimesCircle aria-hidden="true" className="text-3xl text-red-600" />
          )}

          <h1 className="text-[30px] font-semibold text-gray-800">
            {status === "loading"
              ? "Verify your email"
              : status === "success"
                ? "Email verified"
                : "Verification failed"}
          </h1>
          <p className="text-gray-700">{message}</p>

          {status !== "loading" && (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-2 cursor-pointer rounded-3xl border-none bg-[#0A66C2] px-6 py-2 text-white hover:bg-[#0b5eb1]"
            >
              Continue to login
            </button>
          )}
        </section>
      </main>
    </div>
  )
}

export default VerifyEmail
