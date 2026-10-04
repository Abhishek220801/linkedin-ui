import { useNavigate } from "react-router";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center px-6">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-sm px-8 py-12 md:px-16 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Content */}
          <div className="text-center md:text-left max-w-md">
            <div className="text-[#0a66c2] text-7xl md:text-8xl font-bold tracking-tight">
              404
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold text-[#191919] mt-3">
              Page not found
            </h1>

            <p className="text-[#666666] mt-3 text-base md:text-lg leading-relaxed">
              The page you’re looking for doesn’t exist or may have been moved.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-7 justify-center md:justify-start">
              <button
                onClick={() => navigate("/")}
                className="bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Go to Home
              </button>

              <button
                onClick={() => navigate(-1)}
                className="border border-[#0a66c2] text-[#0a66c2] hover:bg-[#e8f3ff] font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>

          {/* Illustration */}
          <div className="w-full max-w-sm flex justify-center">
            <div className="relative">
              <div className="text-[150px] md:text-[190px] font-bold text-[#eef3f8] leading-none select-none">
                404
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#e8f3ff] flex items-center justify-center">
                  <span className="text-5xl md:text-6xl">🔎</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default NotFound;