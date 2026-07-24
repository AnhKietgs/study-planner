import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'; 
import AuthLayout from '../components/AuthLayout';
import Input from "../components/Input";
import Button from "../components/Button";

export default function ForgotPassword() {
  // ÉP TRANG NÀY LUÔN Ở LIGHT MODE
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');

    // Chống lỗi chớp đen khi F5
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleContinue = () => {
    let isValid = true;

    if (!email.trim()) {
      setEmailError('Field is required');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError('Field is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Field is required');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (isValid) {
      setSuccess(true);
      console.log('Password reset successful');
    }
  };

  const handleSignInClick = () => {
    navigate('/login');
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="flex flex-col gap-6 !bg-white">
          {/* TIÊU ĐỀ SMART STUDY PLANNER TRONG TRẠNG THÁI SUCCESS */}
          <div>
            <h1 className="text-2xl font-bold !text-primary">
              Smart Study Planner
            </h1>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-[32px] font-bold !text-[#111827]">Success!</h2>
            <p className="text-base !text-[#6B7280]">
              Your password has been reset successfully.
            </p>
          </div>

          <Button 
            onClick={handleSignInClick}
            tabIndex={-1}
            className="w-full h-[48px] rounded-[12px] font-medium cursor-pointer hover:opacity-90 transition-opacity mt-4"
            style={{ backgroundColor: "#2563EB", color: "#FFFFFF" }}
          >
            Go to Sign In
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6 !bg-white">
        
        {/* TIÊU ĐỀ SMART STUDY PLANNER */}
        <div>
          <h1 className="text-2xl font-bold !text-primary">
            Smart Study Planner
          </h1>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-[32px] font-bold !text-[#111827]">Forgot password</h2>
          <p className="text-base !text-[#6B7280]">
            Enter your registered email and set your new password.
          </p>
        </div>

        <div className="flex flex-col gap-5 mt-2">
          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-medium block !text-[#111827]">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              label=""
              error={emailError}
              onChange={(e: any) => {
                setEmail(e.target.value);
                if (e.target.value) setEmailError('');
              }}
              className={`h-12 rounded-xl border !bg-white !text-[#111827] ${emailError ? "!border-red-500 outline-none ring-1 ring-red-500" : "!border-[#E5E7EB]"}`}
            />
            {emailError && <p className="text-[#EF4444] text-[14px] mt-1">{emailError}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-medium block !text-[#111827]">New Password</label>
            <Input
              type="password"
              placeholder="Enter new password"
              value={password}
              label=""
              error={passwordError}
              onChange={(e: any) => {
                setPassword(e.target.value);
                if (e.target.value) setPasswordError('');
              }}
              showPasswordToggle={true}
              className={`h-12 rounded-xl border !bg-white !text-[#111827] ${passwordError ? "!border-red-500 outline-none ring-1 ring-red-500" : "!border-[#E5E7EB]"}`}
            />
            {passwordError && <p className="text-[#EF4444] text-[14px] mt-1">{passwordError}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[14px] font-medium block !text-[#111827]">Confirm Password</label>
            <Input
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              label=""
              error={confirmPasswordError}
              onChange={(e: any) => {
                setConfirmPassword(e.target.value);
                if (e.target.value) setConfirmPasswordError('');
              }}
              showPasswordToggle={true}
              className={`h-12 rounded-xl border !bg-white !text-[#111827] ${confirmPasswordError ? "!border-red-500 outline-none ring-1 ring-red-500" : "!border-[#E5E7EB]"}`}
            />
            {confirmPasswordError && <p className="text-[#EF4444] text-[14px] mt-1">{confirmPasswordError}</p>}
          </div>
        </div>

        <div className="mt-2">
          <Button 
            onClick={handleContinue}
            className="w-full h-[48px] rounded-[12px] font-medium cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#2563EB", color: "#FFFFFF" }}
          >
            Continue
          </Button>
        </div>

        <p className="text-sm text-center !text-[#6B7280] mt-2">
          Already have an account?{' '}
          <button
            onClick={handleSignInClick}
            className="!text-primary font-medium hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}