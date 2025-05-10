"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import { siteConfig } from "../../constant/siteConfig";

const ResetVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem("resetOtpTimeLeft");
    return savedTime ? parseInt(savedTime, 10) : 420; // 7 minutes
  });
  const [resendDisabled, setResendDisabled] = useState(() => {
    const savedResendCooldown = localStorage.getItem("resetResendCooldownUntil");
    return savedResendCooldown ? Date.now() < parseInt(savedResendCooldown, 10) : false;
  });
  const [resendCooldownLeft, setResendCooldownLeft] = useState(() => {
    const savedResendCooldown = localStorage.getItem("resetResendCooldownUntil");
    return savedResendCooldown 
      ? Math.max(0, Math.floor((parseInt(savedResendCooldown, 10) - Date.now()) / 1000))
      : 0;
  });
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);
  const resendTimerRef = useRef(null);

  const email = localStorage.getItem("newUserEmail");

  // Timer for OTP expiration
  const startOtpTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timerRef.current);
          localStorage.setItem("resetOtpTimeLeft", "0");
          return 0;
        }
        const newTime = prev - 1;
        localStorage.setItem("resetOtpTimeLeft", newTime.toString());
        return newTime;
      });
    }, 1000);
  };

  // Timer for resend cooldown
  const startResendTimer = () => {
    if (resendTimerRef.current) clearInterval(resendTimerRef.current);
    
    resendTimerRef.current = setInterval(() => {
      setResendCooldownLeft((prev) => {
        if (prev <= 0) {
          clearInterval(resendTimerRef.current);
          setResendDisabled(false);
          localStorage.removeItem("resetResendCooldownUntil");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (!email) {
      navigate("../forgot-password");
      return;
    }

    startOtpTimer();
    if (resendDisabled && resendCooldownLeft > 0) {
      startResendTimer();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (resendTimerRef.current) clearInterval(resendTimerRef.current);
    };
  }, [navigate, email]);

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value) || value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    } else if (!value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter a complete 6-digit code");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${siteConfig.BASE_URL}api/users/verify-otp-reset-password`,
        { email, otp: otpValue },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        sessionStorage.setItem("resetOtpVerified", "true");
        localStorage.removeItem("resetOtpTimeLeft");
        localStorage.removeItem("resetResendCooldownUntil");
        navigate("/login/reset-password", { state: { email } });
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid verification code");
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${siteConfig.BASE_URL}api/users/forget-password`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        setTimeLeft(420);
        localStorage.setItem("resetOtpTimeLeft", "420");
        setOtp(["", "", "", "", "", ""]);
        setResendDisabled(true);
        setResendCooldownLeft(60);
        localStorage.setItem("resetResendCooldownUntil", (Date.now() + 60000).toString());
        startOtpTimer();
        startResendTimer();
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col bg-cover bg-center"
      style={{ backgroundImage: "url('/imgs/login/Background.jpg')" }}
    >
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-6 px-4">
        <div className="w-full max-w-[800px] bg-black/40 backdrop-blur-sm rounded-3xl p-6 my-12">
          <div className="flex flex-col items-center text-center">
            <h1 className="font-['Aclonica'] text-white text-3xl mb-4">
              Verify Your Email
            </h1>
            <p className="font-['comfortaa'] text-white mb-6 max-w-lg">
              We've sent a 6-digit code to your email.
              <br />
              Code expires in {formatTime(timeLeft)}
            </p>

            <form onSubmit={handleVerify} className="space-y-6 w-full max-w-sm">
              <div className="flex gap-2 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleInputChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-12 h-12 bg-white/40 rounded-xl text-white text-2xl text-center focus:ring-2 focus:ring-white/60"
                    disabled={isLoading}
                  />
                ))}
              </div>

              {error && <p className="text-red-500 font-['comfortaa']">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-white/50 text-white rounded-full hover:bg-white/60 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </button>

              <p className="text-white font-['comfortaa'] text-sm">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendDisabled || isLoading}
                  className="underline hover:text-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Resend Code {resendDisabled && `(${formatTime(resendCooldownLeft)})`}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResetVerification;