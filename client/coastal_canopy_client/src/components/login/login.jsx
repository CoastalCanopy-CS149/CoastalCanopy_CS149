import { Routes, Route } from "react-router-dom"
import Welcome from "./Welcome"
import LoginForm from "./LoginForm"
import SignUPForm from "./SignUpForm"
import OTPVerification from "./OTPVerification"
import VerificationSuccess from "./VerificationSuccess"
import UsernameSetup from "./UsernameSetup"

// Main login component that handles sub-routes
const Login = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="login" element={<LoginForm />} />
      <Route path="signup" element={<SignUPForm />} />
      <Route path="verify" element={<OTPVerification />} />
      <Route path="verification-success" element={<VerificationSuccess />} />
      <Route path="username-setup" element={<UsernameSetup />} />
    </Routes>
  )
}

export default Login

