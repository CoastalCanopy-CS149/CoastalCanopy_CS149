"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Lock } from "lucide-react"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"

import "@fontsource/aclonica"
import "@fontsource/comfortaa"

const ChangePassword = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // Load user data
  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem("currentUser"))
    const user = JSON.parse(localStorage.getItem("username"))


    console.log(user)

    // if (user) {
    //   navigate("/login")
    //   return
    // }

    setCurrentUser(user)
  }, [navigate])

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }

    setSuccess(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = {}

    // Required fields validation
    if (!formData.currentPassword) newErrors.currentPassword = "Current password is required"
    if (!formData.newPassword) newErrors.newPassword = "New password is required"
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your new password"

    // Verify current password
    if (formData.currentPassword && formData.currentPassword !== currentUser.password) {
      newErrors.currentPassword = "Current password is incorrect"
    }

    // Password validation
    if (formData.newPassword && !validatePassword(formData.newPassword)) {
      newErrors.newPassword =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
    }

    // Check if new password is same as current
    if (formData.newPassword && formData.currentPassword && formData.newPassword === formData.currentPassword) {
      newErrors.newPassword = "New password must be different from current password"
    }

    // Password match validation
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Update user password
    const updatedUser = {
      ...currentUser,
      password: formData.newPassword,
      passwordChangedAt: new Date().toISOString(),
    }

    // Update in users array
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const updatedUsers = users.map((u) => (u.email === currentUser.email ? updatedUser : u))

    localStorage.setItem("users", JSON.stringify(updatedUsers))
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    // Show success message
    setSuccess(true)

    // Clear form
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })

    // Redirect after a short delay
    setTimeout(() => {
      navigate("/")
    }, 3000)
  }

  return (
    <div
      className="min-h-screen w-full overflow-hidden bg-cover bg-center flex flex-col"
      style={{
        backgroundImage: `url('/imgs/login/Background.jpg')`,
      }}
    >
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-6 px-4">
        <div className="relative w-full max-w-[800px] bg-black/40 backdrop-blur-sm rounded-3xl p-4 sm:p-6 mt-12 mb-12">
          <div className="flex flex-col items-center justify-center">
            <h1 className="font-['Aclonica'] text-white text-[24px] sm:text-[30px] text-center mb-1 sm:mb-2">
              Change Password
            </h1>
            <p className="font-['comfortaa'] text-white text-[14px] sm:text-[16px] text-center mb-6 max-w-md">
              Update your password to keep your account secure
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-[400px] space-y-4">
              <div>
                <div className="relative h-[45px] sm:h-[55px]">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={20} />
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    placeholder="Current Password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full h-full pl-12 pr-12 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] sm:text-[16px] shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10"
                  >
                    {showCurrentPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                <div className="h-5 ml-4">
                  {errors.currentPassword && (
                    <p className="text-red-500 text-xs sm:text-sm">{errors.currentPassword}</p>
                  )}
                </div>
              </div>

              <div>
                <div className="relative h-[45px] sm:h-[55px]">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={20} />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="New Password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full h-full pl-12 pr-12 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] sm:text-[16px] shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10"
                  >
                    {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                <div className="h-5 ml-4">
                  {errors.newPassword && <p className="text-red-500 text-xs sm:text-sm">{errors.newPassword}</p>}
                </div>
              </div>

              <div>
                <div className="relative h-[45px] sm:h-[55px]">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full h-full pl-12 pr-12 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] sm:text-[16px] shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10"
                  >
                    {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                <div className="h-5 ml-4">
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs sm:text-sm">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {success && (
                <p className="text-green-500 text-center text-sm">Password changed successfully! Redirecting...</p>
              )}

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  className="w-[60%] h-[45px] sm:h-[50px] rounded-[50px] bg-white/50 text-white font-['comfortaa'] text-[16px] sm:text-[18px] hover:bg-white/60 transition-colors shadow-lg"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ChangePassword

