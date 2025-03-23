"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { User, Mail, Edit, Check } from "lucide-react"
import Navbar from "../navbar/navbar"
import Footer from "../footer/footer"

import "@fontsource/aclonica"
import "@fontsource/comfortaa"
import "@fontsource/acme"

const EditProfile = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  })
  const [originalData, setOriginalData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  })
  const [editableFields, setEditableFields] = useState({
    firstName: false,
    lastName: false,
    email: false,
    username: false,
  })
  const [validFields, setValidFields] = useState({
    firstName: true,
    lastName: true,
    email: true,
    username: true,
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // Load user data
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"))
    const authUser = JSON.parse(localStorage.getItem("authUser"))

    if (!user && !authUser) {
      navigate("/login")
      return
    }

    let userData = {}

    if (user) {
      userData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        username: user.username || "",
      }
      setCurrentUser(user)
    } else if (authUser) {
      // For Google sign-in users
      const username = localStorage.getItem(`username_${authUser.uid}`)
      const nameParts = authUser.displayName ? authUser.displayName.split(" ") : ["", ""]

      userData = {
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: authUser.email || "",
        username: username || "",
      }
      setCurrentUser({
        ...authUser,
        username: username,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
      })
    }

    setFormData(userData)
    setOriginalData(userData)
  }, [navigate])

  const validateName = (name) => {
    return /^[A-Za-z]{2,50}$/.test(name)
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateUsername = (username) => {
    return /^(?!.*[._]{2})[a-z0-9](?:[a-z0-9._]{2,18})[a-z0-9]$/.test(username.toLowerCase())
  }

  const checkExistingUsername = (username) => {
    if (username.toLowerCase() === originalData.username.toLowerCase()) {
      return false // Same username, no conflict
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    return users.some((user) => user.username.toLowerCase() === username.toLowerCase())
  }

  const checkExistingEmail = (email) => {
    if (email.toLowerCase() === originalData.email.toLowerCase()) {
      return false // Same email, no conflict
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]")
    return users.some((user) => user.email.toLowerCase() === email.toLowerCase())
  }

  const toggleEditable = (field) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))

    // Reset validation when toggling edit mode
    if (!editableFields[field]) {
      validateField(field, formData[field])
    }
  }

  const validateField = (field, value) => {
    let isValid = true
    let errorMessage = ""

    switch (field) {
      case "firstName":
      case "lastName":
        if (!value) {
          isValid = false
          errorMessage = `${field === "firstName" ? "First" : "Last"} name is required`
        } else if (!validateName(value)) {
          isValid = false
          errorMessage = "Name must be 2-50 letters (A-Z, a-z) with no numbers or special characters"
        }
        break

      case "email":
        if (!value) {
          isValid = false
          errorMessage = "Email is required"
        } else if (!validateEmail(value)) {
          isValid = false
          errorMessage = "Please enter a valid email address"
        } else if (checkExistingEmail(value)) {
          isValid = false
          errorMessage = "This email is already registered with another account. Please use another email"
        }
        break

      case "username":
        if (!value) {
          isValid = false
          errorMessage = "Username is required"
        } else if (!validateUsername(value)) {
          isValid = false
          errorMessage =
            "Username must be 4-20 characters, start & end with letters/numbers, can use dots or underscores along"
        } else if (checkExistingUsername(value)) {
          isValid = false
          errorMessage = "This username is already taken. Please choose another one"
        }
        break

      default:
        break
    }

    setValidFields((prev) => ({
      ...prev,
      [field]: isValid,
    }))

    setErrors((prev) => ({
      ...prev,
      [field]: errorMessage,
    }))

    return isValid
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Validate as user types
    validateField(name, value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Check if all fields are valid
    const allFieldsValid = Object.values(validFields).every((valid) => valid)

    if (!allFieldsValid) {
      return
    }

    // Update user data
    const user = JSON.parse(localStorage.getItem("currentUser"))
    const authUser = JSON.parse(localStorage.getItem("authUser"))

    if (user) {
      // Regular user
      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
      }

      // Update in users array
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const updatedUsers = users.map((u) => (u.email === originalData.email ? updatedUser : u))

      localStorage.setItem("users", JSON.stringify(updatedUsers))
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    } else if (authUser) {
      // Google sign-in user
      const uid = authUser.uid
      localStorage.setItem(`username_${uid}`, formData.username)
      localStorage.setItem("currentUsername", formData.username)

      // Update currentUser for Google users too
      const updatedUser = {
        ...authUser,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
      }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))
    }

    // Show success message
    setSuccess(true)

    // Redirect to home after a short delay
    setTimeout(() => {
      navigate("/")
    }, 1500)
  }

  // Get user's first name initial
  const getUserInitial = () => {
    if (!currentUser) return ""

    if (currentUser.firstName) {
      return currentUser.firstName.charAt(0).toUpperCase()
    } else if (currentUser.username) {
      return currentUser.username.charAt(0).toUpperCase()
    } else if (currentUser.email) {
      return currentUser.email.charAt(0).toUpperCase()
    }

    return "U"
  }

  // Check if all fields are valid and any field has been edited
  const canSave = () => {
    const allFieldsValid = Object.values(validFields).every((valid) => valid)
    const anyFieldEdited =
      formData.firstName !== originalData.firstName ||
      formData.lastName !== originalData.lastName ||
      formData.email !== originalData.email ||
      formData.username !== originalData.username

    return allFieldsValid && anyFieldEdited
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
              Edit Profile
            </h1>
            <p className="font-['comfortaa'] text-white text-[14px] sm:text-[16px] text-center mb-4">
              Keep your info up to date
            </p>

            {/* User Avatar */}
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/30 text-white font-['comfortaa'] text-2xl font-bold mb-4">
              {getUserInitial()}
            </div>

            {/* Username Display */}
            <div className="text-white font-['comfortaa'] font-bold text-center mb-6 text-xl">
              Hello {currentUser?.username || "User"}
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-[630px] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                {/* First Name */}
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={16} />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={!editableFields.firstName}
                      className="w-full h-[45px] pl-10 pr-10 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] shadow-lg disabled:opacity-50"
                    />
                    {editableFields.firstName && validFields.firstName ? (
                      <Check
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 z-10"
                        size={16}
                      />
                    ) : (
                      <Edit
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10 cursor-pointer"
                        size={16}
                        onClick={() => toggleEditable("firstName")}
                      />
                    )}
                  </div>
                  <div className="h-5 ml-4">
                    {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={16} />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={!editableFields.lastName}
                      className="w-full h-[45px] pl-10 pr-10 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] shadow-lg disabled:opacity-50"
                    />
                    {editableFields.lastName && validFields.lastName ? (
                      <Check
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 z-10"
                        size={16}
                      />
                    ) : (
                      <Edit
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10 cursor-pointer"
                        size={16}
                        onClick={() => toggleEditable("lastName")}
                      />
                    )}
                  </div>
                  <div className="h-5 ml-4">
                    {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={16} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!editableFields.email}
                      className="w-full h-[45px] pl-10 pr-10 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] shadow-lg disabled:opacity-50"
                    />
                    {editableFields.email && validFields.email ? (
                      <Check
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 z-10"
                        size={16}
                      />
                    ) : (
                      <Edit
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10 cursor-pointer"
                        size={16}
                        onClick={() => toggleEditable("email")}
                      />
                    )}
                  </div>
                  <div className="h-5 ml-4">
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>
                </div>

                {/* Username */}
                <div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white z-10" size={16} />
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={!editableFields.username}
                      className="w-full h-[45px] pl-10 pr-10 rounded-[50px] bg-white/30 text-white placeholder-white font-['comfortaa'] text-[14px] shadow-lg disabled:opacity-50"
                    />
                    {editableFields.username && validFields.username ? (
                      <Check
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 z-10"
                        size={16}
                      />
                    ) : (
                      <Edit
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white z-10 cursor-pointer"
                        size={16}
                        onClick={() => toggleEditable("username")}
                      />
                    )}
                  </div>
                  <div className="h-5 ml-4">
                    {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
                  </div>
                </div>
              </div>

              {success && (
                <p className="text-green-500 text-center text-sm">Profile updated successfully! Redirecting...</p>
              )}

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  disabled={!canSave()}
                  className="w-[50%] h-[45px] sm:h-[50px] rounded-[50px] bg-white/50 text-white font-['comfortaa'] text-[16px] sm:text-[18px] hover:bg-white/60 transition-colors shadow-lg disabled:opacity-50"
                >
                  Save
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

export default EditProfile

