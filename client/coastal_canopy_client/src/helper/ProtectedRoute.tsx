import React from "react";

import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { X } from "lucide-react";
import Home from "../components/home/home";

const ProtectedRoute = ({ children }) => {
  const { isUserLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (!isUserLoggedIn) {
    return (
      <>
        {/* Login Required Modal */}
        <Home />
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-black/80 backdrop-blur-md rounded-lg p-6 max-w-sm w-[90%] relative">
            <button
              onClick={() => navigate("/")}
              className="absolute top-2 right-2 text-white hover:text-gray-300 hidden sm:block"
            >
              <X size={20} />
            </button>
            <h3 className="text-white font-['comfortaa'] text-xl font-bold mb-4 text-center">
              Hey there!
            </h3>
            <p className="text-white font-['comfortaa'] text-center mb-6">
              Log in to unlock this feature and explore more cool stuff!
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-white/50 hover:bg-white/60 text-white font-['comfortaa'] font-bold rounded-full animate-pulse"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white font-['comfortaa'] font-bold rounded-full sm:hidden"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </>
    );
    // return <Navigate to="/login" />
  }

  return <Outlet />;
};
export default ProtectedRoute;
