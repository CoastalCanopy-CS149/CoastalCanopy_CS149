export default function sign_up() {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/imgs/sign_up/background_sign.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
  
        {/* Centered Blur Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-6xl h-4/5 bg-white/20 backdrop-blur-sm rounded-3xl" />
  
        {/* Content */}
        <div className="relative z-10 text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white font-mono">Nature's Ally Awaits You</h1>
          <p className="text-2xl md:text-3xl text-gray-200 font-serif">Login. Protect. Preserve</p>
          <div className="space-y-4">
            <button className="w-64 py-3 px-6 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors">
              Sign In
            </button>
            <div>
              <a href="#" className="text-white underline hover:text-gray-200">
                Create an account
              </a>
            </div>
          </div>
        </div>
  
        
      </div>
    )
  }