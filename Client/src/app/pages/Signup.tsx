import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import Input from "../components/Input";
import Button from "../components/Button";

import { authApi } from "../../api/authApi";

export default function Signup() {
  // ÉP TRANG NÀY LUÔN Ở LIGHT MODE
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    let isValid = true;

    if (!fullName.trim()) {
      setFullNameError("Please enter full name");
      isValid = false;
    } else {
      setFullNameError("");
    }

    if (!email.trim()) {
      setEmailError("Field is required");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Field is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError("Please enter password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (isValid) {
      try {
        const payload = { fullName, email, password, confirmPassword };
        await authApi.register(payload);
        alert("Account created successfully! Please sign in.");
        navigate("/login"); 
      } catch (error: any) {
        console.error("Lỗi đăng ký:", error);
        const beErrorMessage = error.response?.data?.message || "Registration failed. Please try again.";
        setEmailError(beErrorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center !bg-[#F8FAFC]">
      <div 
        className="flex overflow-hidden !bg-white"
        style={{
          width: '1100px',
          height: '720px',
          borderRadius: '24px',
          boxShadow: '0px 10px 30px rgba(0,0,0,0.08)'
        }}
      >
        <div className="w-1/2 overflow-y-auto flex flex-col !bg-white" style={{ padding: '48px' }}>
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-bold !text-primary">
                Smart Study Planner
              </h1>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-[32px] font-bold !text-[#111827]">
                Create Account
              </h2>
              <p className="text-base !text-[#6B7280]">
                Start organizing your study life today.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-2">
              
              {/* Full Name */}
              <div className="flex flex-col gap-1">
                <label htmlFor="fullname" className="text-[14px] font-medium block !text-[#111827]">
                  First name
                </label>
                <Input
                  id="fullname"
                  type="text"
                  placeholder="Enter first name"
                  value={fullName}
                  label=""
                  error={fullNameError}
                  onChange={(e: any) => {
                    setFullName(e.target.value);
                    if (e.target.value) setFullNameError("");
                  }}
                  className={`h-12 rounded-xl border !bg-white !text-[#111827] ${fullNameError ? "!border-red-500 outline-none ring-1 ring-red-500" : "!border-[#E5E7EB]"}`}
                />
                {fullNameError && <p className="text-[#EF4444] text-[14px] mt-1">{fullNameError}</p>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-[14px] font-medium block !text-[#111827]">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  label=""
                  error={emailError}
                  onChange={(e: any) => {
                    setEmail(e.target.value);
                    if (e.target.value) setEmailError("");
                  }}
                  className={`h-12 rounded-xl border !bg-white !text-[#111827] ${emailError ? "!border-red-500 outline-none ring-1 ring-red-500" : "!border-[#E5E7EB]"}`}
                />
                {emailError && <p className="text-[#EF4444] text-[14px] mt-1">{emailError}</p>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-[14px] font-medium block !text-[#111827]">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    label=""
                    error={passwordError}
                    onChange={(e: any) => {
                      setPassword(e.target.value);
                      if (e.target.value) setPasswordError("");
                    }}
                    className={`h-12 rounded-xl border pr-12 w-full !bg-white !text-[#111827] ${passwordError ? "!border-red-500 outline-none ring-1 ring-red-500" : "!border-[#E5E7EB]"}`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[24px] -translate-y-1/2 !text-gray-500 hover:!text-gray-700 z-10 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordError && <p className="text-[#EF4444] text-[14px] mt-1">{passwordError}</p>}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <label htmlFor="confirmPassword" className="text-[14px] font-medium block !text-[#111827]">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Enter confirm password"
                    value={confirmPassword}
                    label=""
                    error={confirmPasswordError}
                    onChange={(e: any) => {
                      setConfirmPassword(e.target.value);
                      if (e.target.value) setConfirmPasswordError("");
                    }}
                    className={`h-12 rounded-xl border pr-12 w-full !bg-white !text-[#111827] ${confirmPasswordError ? "!border-red-500 outline-none ring-1 ring-red-500" : "!border-[#E5E7EB]"}`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-[24px] -translate-y-1/2 !text-gray-500 hover:!text-gray-700 z-10 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPasswordError && <p className="text-[#EF4444] text-[14px] mt-1">{confirmPasswordError}</p>}
              </div>

              {/* Primary Button */}
              <Button
                type="submit"
                className="w-full h-12 rounded-xl font-medium cursor-pointer hover:opacity-90 transition-opacity mt-2"
                style={{ backgroundColor: '#2563EB', color: 'white' }}
              >
                Continue
              </Button>
            </form>

            <div className="mt-4" />

            {/* Bottom Section */}
            <div className="text-center pb-6">
              <p className="text-sm !text-[#6B7280]">
                Already have an account?{' '}
                <Link to="/login" className="font-medium hover:underline transition-all !text-primary">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Gradient Hero */}
        <div 
          className="w-1/2 flex items-center justify-center relative"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)', borderRadius: '24px' }}
        >
          <div className="px-12 text-center z-10">
            <h3 className="text-[28px] font-bold text-white mb-4 leading-tight">
              Manage your classes, tasks, and exams in one place.
            </h3>
            <p className="text-base text-white/80 leading-relaxed">
              Stay productive and never miss a deadline again.
            </p>
          </div>
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1769794370964-78412732f1cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHklMjBkZXNrJTIwbGFwdG9wJTIwbm90ZWJvb2slMjBtaW5pbWFsfGVufDF8fHx8MTc3MjUyMTQ3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
        </div>
      </div>
    </div>
  );
}