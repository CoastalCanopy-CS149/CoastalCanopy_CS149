import { Link } from "react-router-dom"

import "@fontsource/aclonica"
import "@fontsource/comfortaa"
import "@fontsource/actor"

const Footer = () => {
  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/people/Coastal-Canopy/61572263144876/?rdid=hx0G3wqqfZ9QVqXi&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Do7jm4fVm%2F",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/coastalcanopy.org.lk?igsh=Njdsbzh4Ym80bGg=",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/coastal-canopy/",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      ),
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@coastalcanopylk?_t=ZS-8tPtEIhxcBk&_r=1",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.59-1.16-2.59-2.5 0-1.34 1.17-2.5 2.59-2.5.27 0 .53.04.77.12v-3.1a6.212 6.212 0 0 0-.77-.05c-3.37 0-6.14 2.73-6.14 6.11 0 3.37 2.77 6.1 6.14 6.1 3.37 0 6.13-2.73 6.13-6.1V9.41a7.68 7.68 0 0 0 4.84 1.69v-3.1a4.257 4.257 0 0 1-4.27-2.18z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="w-full bg-[#82889880] backdrop-blur-sm">
      <div className="max-w-[1440px] mx-auto min-h-[121px] flex flex-col justify-between py-4 px-4 sm:px-8">
        {/* Mobile layout */}
        <div className="flex flex-col items-center gap-4 sm:hidden">
          <Link to="/" className="font-['Aclonica'] text-white text-2xl hover:text-gray-200">
            CoastalCanopy
          </Link>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-200 transition-colors hover:scale-110"
              >
                {social.icon}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[#D9D9D9]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
            </svg>
            <span className="font-['Actor'] text-xl">CoastalCanopy 2025</span>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:flex sm:flex-col sm:justify-between">
          <div className="flex justify-between items-center">
            <Link to="/" className="font-['Aclonica'] text-white text-3xl hover:text-gray-200">
              CoastalCanopy
            </Link>
            <div className="flex items-center justify-end flex-1">
              <div className="w-[300px] flex justify-between">
                <Link
                  to="/"
                  className="text-white font-['comfortaa'] text-2xl font-bold hover:text-gray-200 transition-all duration-200 hover:scale-105"
                >
                  Home
                </Link>
                <Link
                  to="/monitoring"
                  className="text-white font-['comfortaa'] text-2xl font-bold hover:text-gray-200 transition-all duration-200 hover:scale-105"
                >
                  Monitoring
                </Link>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-200 transition-colors hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2 text-[#D9D9D9] absolute left-1/2 transform -translate-x-1/2 bottom-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
              </svg>
              <span className="font-['Actor'] text-2xl">CoastalCanopy 2025</span>
            </div>
            <div className="flex items-center justify-end flex-1">
              <div className="w-[300px] flex justify-between">
                <Link
                  to="/reporting"
                  className="text-white font-['comfortaa'] text-2xl font-bold hover:text-gray-200 transition-all duration-200 hover:scale-105"
                >
                  Reporting
                </Link>
                <Link
                  to="/education"
                  className="text-white font-['comfortaa'] text-2xl font-bold hover:text-gray-200 transition-all duration-200 hover:scale-105"
                >
                  Map
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer

