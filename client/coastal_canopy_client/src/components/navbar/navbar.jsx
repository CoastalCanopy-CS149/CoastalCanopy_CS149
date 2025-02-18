import { useState } from "react"
import { Menu, User } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Monitoring", path: "/monitoring" },
    { name: "Reporting", path: "/reporting" },
    { name: "Learn", path: "/learn" },
    { name: "AR View", path: "/ar-view" },
    { name: "Eco Act", path: "/eco-act" },
    { name: "Social Hub", path: "/social-hub" },
    { name: "Shop", path: "/shop" },
    { name: "About Us", path: "/about" },
  ]

  const isCurrentPath = (path) => {
    if (path === "/" && location.pathname === "/") return true
    if (path !== "/" && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="w-full">
      <nav className="max-w-full mx-auto">
        <div className="relative flex items-center justify-between px-8 py-4 bg-black/40 backdrop-blur-sm">
          <Link to="/home" className="flex items-center gap-3">
            <img src="/imgs/navbar/logo.png" alt="CoastalCanopy Logo" className="h-16 w-16 rounded-full" />
            <span className="font-['Aclonica'] text-[32px] text-white">CoastalCanopy</span>
          </Link>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8">
              {menuItems.slice(0, 4).map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-white font-comfortaa text-[18px] font-bold hover:opacity-80 ${
                    isCurrentPath(item.path) ? "opacity-100" : "opacity-80"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <button
              className="text-white z-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="menu-items"
            >
              <Menu size={24} />
            </button>
            <button className="text-white" onClick={() => navigate("/welcome")}>
              <User size={24} />
            </button>
          </div>

          {/* Menu Overlay */}
          {isMenuOpen && (
            <div className="fixed inset-0 bg-transparent z-40" onClick={() => setIsMenuOpen(false)}>
              <div
                className="absolute right-4 top-20 w-[254px] bg-white/25 backdrop-blur-sm rounded-[10px] border border-white/100 shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`block px-4 py-3 font-comfortaa text-[24px] font-bold text-white hover:bg-white/50 transition-colors text-center
                        ${isCurrentPath(item.path) ? "bg-white/52" : ""}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Navbar

