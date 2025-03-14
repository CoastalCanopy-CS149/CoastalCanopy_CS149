"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { User } from "lucide-react"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"

import "@fontsource/aclonica"
import "@fontsource/comfortaa"
import "@fontsource/acme"

const UsernameSetup = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [existingUsernames, setExistingUsernames] = useState([])

  // Load existing usernames from localStorage on component mount
  useEffect(() => {
    const storedUsernames = localStorage.getItem("usernames")
    if (storedUsernames) {
      setExistingUsernames(JSON.parse(storedUsernames))
    }
  }, [])

  const validateUsername = (username) => {
    return /^(?!.*[_.]{2})[a-zA-Z0-9][a-zA-Z0-9_.]{2,18}[a-zA-Z0-9]$/.test(username)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Check if username is empty
    if (!username.trim()) {
      setError("Username is required")
      return
    }

    // Validate username format
    if (!validateUsername(username)) {
      setError(
        "Username must be 4-20 characters, start and end with letter/number, and can contain dots and underscores (not consecutive)",
      )
      return
    }

    // Check if username already exists
    if (existingUsernames.includes(username)) {
      setError("This username is already taken. Please choose another one.")
      return
    }

    // Save username to localStorage
    const updatedUsernames = [...existingUsernames, username]
    localStorage.setItem("usernames", JSON.stringify(updatedUsernames))

    // Save the current user's username
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (user.uid) {
      localStorage.setItem(`username_${user.uid}`, username)
    }
    localStorage.setItem("currentUsername", username)

    // Redirect to home page
    navigate("/")
  }

  return (
    <div
      className="min-h-screen w-screen overflow-y-auto overflow-x-hidden bg-cover bg-center flex flex-col"
      style={{
        backgroundImage: `url('/imgs/login/Background.jpg')`,
      }}
    >
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-10">
        <div className="relative w-[1000px] h-[700px] bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="font-['Aclonica'] text-white text-[36px] text-center mb-2">Set Up Your Username</h1>
            <p className="font-['Comfortaa'] text-white text-[18px] text-center mb-10">
              One last step! Pick a username to get started
            </p>

            <form onSubmit={handleSubmit} className="space-y-8 w-[535px]">
              <div className="relative">
                <User className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white" size={24} />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value)
                    setError("") // Clear error when user types
                  }}
                  className="w-full h-[75px] pl-16 pr-4 rounded-[50px] bg-white/30 text-white placeholder-white font-['Comfortaa'] text-[22px] shadow-lg"
                />
                {error && <p className="text-red-500 mt-1 ml-4 text-sm">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-[474px] h-[70px] mx-auto block rounded-[50px] bg-white/50 text-white font-['Comfortaa'] text-[28px] hover:bg-white/60 transition-colors shadow-lg mt-8"
              >
                Save & Get Started
              </button>
            </form>

            <div className="mt-12 text-center px-8 max-w-[800px]">
              <p className="font-['Acme'] text-white text-[24px] mb-4">
                In the embrace of the mangroves, the ocean whispers,
                <br />
                the land breathes, and life flourishes.
              </p>
              <p className="font-['Acme'] text-white text-[32px]">
                Mangroves teach us that even in the harshest conditions,
                <br />
                life finds a way to thrive.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default UsernameSetup

