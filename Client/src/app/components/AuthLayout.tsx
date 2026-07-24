import React from 'react';
import { GraduationCap } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-[1100px] h-[640px] bg-white rounded-3xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] flex overflow-hidden">
        {/* Left Side - Form Area */}
        <div className="w-1/2 p-12 flex flex-col justify-center">{children}</div>

        {/* Right Side - Gradient Panel */}
        <div className="w-1/2 bg-gradient-to-br rounded-3xl relative flex items-center justify-center"
        style={{
            background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)"
          }}
        >
          {/* Background Image */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1769794370964-78412732f1cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHklMjBkZXNrJTIwbGFwdG9wJTIwbm90ZWJvb2slMjBtaW5pbWFsfGVufDF8fHx8MTc3MjUyMTQ3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-12">
            <p className="text-white/80 text-sm mb-4">
              Everything you need to stay on track.
            </p>
            <h2 className="text-white text-[28px] font-bold leading-tight">
              Manage your classes, tasks, exams, and more. All in one place.
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
