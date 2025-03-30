import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import axios from "axios";
import { siteConfig } from "../../constant/siteConfig";
import { useAuth } from "../../context/AuthContext";
import { useAppContext } from "../../context/AppContext";

import "@fontsource/aclonica";
import "@fontsource/comfortaa";

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem("otpTimeLeft");
    return savedTime ? parseInt(savedTime, 10) : 420;
  });
  const [isExpired, setIsExpired] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [isResendLocked, setIsResendLocked] = useState(() => {
    const savedLocked = localStorage.getItem("otpIsResendLocked");
    return savedLocked ? JSON.parse(savedLocked) : false;
  });
  const [lockTimeLeft, setLockTimeLeft] = useState(() => {
    const savedLockTime = localStorage.getItem("otpLockTimeLeft");
    return savedLockTime ? parseInt(savedLockTime, 10) : 0;
  });
  const inputRefs = useRef([]);
  const timerRef = useRef(null);
  const lockTimerRef = useRef(null);
  const formData = location.state?.formData;
  const [isLoading, setIsLoading] = useState(false);
  const { newUserEmail } = useAuth();
  const { addSuccess, addError } = useAppContext();

  // Start the OTP validity timer
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          setIsExpired(true);
          localStorage.setItem("otpTimeLeft", "0");
          return 0;
        }
        const newTime = prevTime - 1;
        localStorage.setItem("otpTimeLeft", newTime.toString());
        return newTime;
      });
    }, 1000);
  };

  // Start the resend lockout timer
  const startLockTimer = (isNewLock = false) => {
    if (isNewLock) {
      setLockTimeLeft(600);
      localStorage.setItem("otpLockTimeLeft", "600");
      setIsResendLocked(true);
      localStorage.setItem("otpIsResendLocked", "true");
    }
    if (lockTimerRef.current) clearInterval(lockTimerRef.current);
    lockTimerRef.current = setInterval(() => {
      setLockTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(lockTimerRef.current);
          setIsResendLocked(false);
          localStorage.setItem("otpIsResendLocked", "false");
          localStorage.setItem("otpLockTimeLeft", "0");
          return 0;
        }
        const newTime = prevTime - 1;
        localStorage.setItem("otpLockTimeLeft", newTime.toString());
        return newTime;
      });
    }, 1000);
  };

  // Initialize timers on mount
  useEffect(() => {
    const newUser = localStorage.getItem("newUserEmail");
    if (!newUser) {
      console.log('newUserEmail is null', newUser);
      navigate("/login/signup");
      return;
    }
    startTimer();
    if (isResendLocked) startLockTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (lockTimerRef.current) clearInterval(lockTimerRef.current);
    };
  }, [navigate, newUserEmail]);

  // Update localStorage when resendCount changes
  useEffect(() => {
    localStorage.setItem("otpResendCount", resendCount.toString());
  }, [resendCount]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");
    if (value && index < 5) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter the complete OTP");
      return;
    }
    verifyOtp();
  };

  const verifyOtp = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${siteConfig.BASE_URL}api/users/verify-otp`,
        { otp: otp.join(""), email: newUserEmail },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        setIsLoading(false);
        addSuccess(response.data.message);
        localStorage.removeItem("otpTimeLeft");
        localStorage.removeItem("otpResendCount");
        localStorage.removeItem("otpIsResendLocked");
        localStorage.removeItem("otpLockTimeLeft");
        navigate("/login/verification-success");
      }
    } catch (error) {
      addError(error.response.data.message);
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (isResendLocked) return;
    const newResendCount = resendCount + 1;
    setResendCount(newResendCount);
    if (newResendCount >= 3) {
      setIsResendLocked(true);
      startLockTimer(true); // Pass true for a new lock
    }
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setTimeLeft(420);
    localStorage.setItem("otpTimeLeft", "420");
    setIsExpired(false);
    startTimer();
    try {
      const response = await axios.post(
        `${siteConfig.BASE_URL}api/users/resend-otp`,
        { email: newUserEmail },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) addSuccess(response.data.message);
    } catch (error) {
      addError(error.response.data.message);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="min-h-screen w-full overflow-y-auto overflow-x-hidden bg-cover bg-center flex flex-col"
      style={{ backgroundImage: `url('/imgs/login/Background.jpg')` }}
    >
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-black/40 backdrop-blur-sm rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="font-['Aclonica'] text-white text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-4">
              OTP Verification
            </h1>
            <div className="font-['comfortaa'] text-white text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">
              <p>OTP has been sent to your registered email.</p>
              <p>Please enter it below to verify your account.</p>
              <p>
                For your security, OTPs are valid for{" "}
                <span className="font-bold">{formatTime(timeLeft)}</span> only.
              </p>
            </div>

            <form onSubmit={handleVerify} className="w-full space-y-6 sm:space-y-8">
              <div className="flex justify-center gap-2 sm:gap-3 lg:gap-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/40 rounded-2xl text-center text-white text-xl sm:text-2xl lg:text-3xl font-['comfortaa'] focus:outline-none focus:ring-2 focus:ring-white/60"
                  />
                ))}
              </div>

              {error && (
                <p className="text-red-500 text-center font-['comfortaa'] text-xs sm:text-sm">
                  {error}
                </p>
              )}

              <div className="flex flex-col items-center gap-4 sm:gap-6">
                <button
                  type="submit"
                  className="w-full max-w-xs sm:max-w-sm p-3 sm:p-4 rounded-full bg-white/50 text-white font-['comfortaa'] text-base sm:text-lg lg:text-xl hover:bg-white/60 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isExpired || isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </button>

                <p className="text-white font-['comfortaa'] text-sm sm:text-base lg:text-lg">
                  Didn’t receive the OTP? <br/>
                  Check your Spam folder or{" "}
                  {isResendLocked ? (
                    <span className="text-gray-400">
                      Resend locked for {formatTime(lockTimeLeft)}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      className="underline hover:text-gray-200"
                    >
                      Resend OTP {resendCount > 0 ? `(${resendCount}/3)` : ""}
                    </button>
                  )}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OTPVerification;