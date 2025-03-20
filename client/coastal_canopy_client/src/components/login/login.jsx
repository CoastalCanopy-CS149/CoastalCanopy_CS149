import { Routes, Route } from "react-router-dom"
import Welcome from "./Welcome"
import LoginForm from "./LoginForm"
import SignUPForm from "./SignUpForm"
import OTPVerification from "./OTPVerification"
import VerificationSuccess from "./VerificationSuccess"
import UsernameSetup from "./UsernameSetup"
import ForgotPassword from "./ForgotPassword"
import ResetVerification from "./ResetVerification"
import ResetPassword from "./ResetPassword"
import ResetPasswordSuccess from "./ResetPasswordSuccess"

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
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-verification" element={<ResetVerification />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route path="reset-success" element={<ResetPasswordSuccess />} />
    </Routes>
  )
}

export default Login

