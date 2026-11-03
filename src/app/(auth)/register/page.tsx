"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Image as ImageIcon, Eye, EyeOff, Camera, ArrowRight, CheckCircle2 } from "lucide-react";
import { signUp } from "@/lib/auth-client";  
import { toast } from "@/components/ui/toast";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState(""); // Password validation live check korar jonno state

  // Password validation requirements
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Password validation check
    if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      toast.add({
        title: "Weak Password",
        description: "Please fulfill all password requirements listed below.",
      });
      return;
    }

    setLoading(true);

    // 2. currentTarget ebong FormData diye data collect kora
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await signUp.email(
        {
          email: data.email as string,
          password: data.password as string,
          name: data.name as string,
          image: data.image as string, // Profile image URL
        },
        {
          onRequest: () => setLoading(true),
          onSuccess: () => {
            toast.add({
              title: "Account Created! 🎉",
              description: "Welcome to StudioSpace. Signed up successfully.",
            });
            window.location.href = "/login";
          },
          onError: (ctx) => {
            toast.add({
              title: "Registration Failed",
              description: ctx.error.message || "Something went wrong. Try again.",
            });
            setLoading(false);
          },
        }
      );
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden text-slate-100">
      
      {/* Background Ambient Glow Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-800/80 relative z-10 my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-600 px-6 py-8 text-center text-white relative">
          <div className="w-12 h-12 mx-auto bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner mb-3 border border-white/20">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Create Account</h2>
          <p className="text-xs text-purple-200 mt-1">Join StudioSpace & book creative spaces</p>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <User className="w-4 h-4" />
                </span>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Swarna Sutradhar"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-950/60 shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-950/60 shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Profile Image URL Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Profile Image URL <span className="text-slate-500 lowercase font-normal">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <ImageIcon className="w-4 h-4" />
                </span>
                <input
                  name="image"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-950/60 shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-950/60 shadow-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Requirement Checklist */}
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60 space-y-1.5 mt-2 text-xs">
                <p className="text-slate-400 font-medium mb-1">Password must contain:</p>
                <div className={`flex items-center gap-2 ${hasMinLength ? "text-purple-400" : "text-slate-500"}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> At least 8 characters
                </div>
                <div className={`flex items-center gap-2 ${hasUppercase ? "text-purple-400" : "text-slate-500"}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> One uppercase letter (A-Z)
                </div>
                <div className={`flex items-center gap-2 ${hasLowercase ? "text-purple-400" : "text-slate-500"}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> One lowercase letter (a-z)
                </div>
                <div className={`flex items-center gap-2 ${hasNumber ? "text-purple-400" : "text-slate-500"}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> One number (0-9)
                </div>
                <div className={`flex items-center gap-2 ${hasSpecialChar ? "text-purple-400" : "text-slate-500"}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> One special character (@$!%*?&)
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-purple-900/30 text-sm mt-3 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-xs text-slate-500 uppercase tracking-wider">
              or
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Login Redirect Link */}
          <p className="text-center text-xs text-slate-400 pt-1">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-400 font-semibold hover:underline">
              Sign In here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}