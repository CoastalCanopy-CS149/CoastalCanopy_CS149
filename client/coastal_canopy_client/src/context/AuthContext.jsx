import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { siteConfig } from "../constant/siteConfig";


const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [user, setUser] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsUserLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const storedNewUserEmail = localStorage.getItem("newUserEmail");
    if (storedNewUserEmail) {
      setNewUserEmail(storedNewUserEmail);
    }
  }, []);

  // Function to verify access token
  const isNotExpired = async (accessToken) => {
    try {
      const res = await axios.post(
        `${siteConfig.BASE_URL}api/users/verify-token`,
        {  accessToken },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.status === 200 && res.data.message[0].valid) {
        
        return true; 
      }else{
        return false;
      }

    } catch (error) {
      
      return false; 
    }
  };

  // Verify access token 
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    const checkToken = async () => {
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const accessToken = userData.token;
        if (!accessToken) return
        if(!await isNotExpired(accessToken)){
          
          logout();
        }
        
      }
    };

    checkToken();
  }, []);

  const newUserEmailInit = (email) => {
    setNewUserEmail(email);
    localStorage.setItem("newUserEmail", email);
  };

  const login = (userData) => {
    setIsUserLoggedIn(true);
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    window.location.href = "/";
  };

  const logout = () => {
    setIsUserLoggedIn(false);
    setUser(null);
    setNewUserEmail("");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };


  return (
    <AuthContext.Provider
      value={{
        isUserLoggedIn,
        login,
        logout,
        newUserEmail,
        newUserEmailInit,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
