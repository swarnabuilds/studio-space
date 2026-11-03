 
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Camera, ArrowRight } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Email and Password Sign In
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn.email(
        { email, password },
        {
          onRequest: () => setLoading(true),
          onSuccess: () => {
            toast.add({
              title: "Success! 🎉",
              description: "Signed in successfully to StudioSpace.",
            });

            window.location.href = "/studios";
          },
          onError: (ctx) => {
            toast.add({
              title: "Sign In Failed",
              description: ctx.error.message || "Invalid email or password.",
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

  // Google Sign In
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/studios",
      });
    } catch (err) {
      console.error(err);

      toast.add({
        title: "Google Sign In Failed",
        description: "Unable to sign in with Google. Please try again.",
      });

      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden text-slate-100">

      {/* Glow Backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-800/80 relative z-10">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-600 px-6 py-8 text-center text-white relative">
          <div className="w-12 h-12 mx-auto bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner mb-3 border border-white/20">
            <Camera className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight">
            Welcome Back
          </h2>

          <p className="text-xs text-purple-200 mt-1">
            Sign in to your StudioSpace account
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">

          <form onSubmit={handleSignIn} className="space-y-4">

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-950/60 shadow-sm transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>

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
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-purple-900/30 text-sm mt-2 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800"></div>

            <span className="flex-shrink mx-4 text-xs text-slate-500 uppercase tracking-wider">
              or continue with
            </span>

            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 bg-slate-950/60 border border-slate-800 hover:bg-slate-800 text-slate-200 font-medium py-3 rounded-xl transition-all shadow-sm text-sm disabled:opacity-70"
          >
            {googleLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.18 21.31 7.24 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.19C.43 8.13 0 9.87 1.19 17.4l4.08-3.16z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.24 0 3.18 2.69 1.19 6.6l4.08 3.16c.95-2.85 3.6-4.96 6.73-4.96z"
                  />
                </svg>

                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Footer Link */}
          <p className="text-center text-xs text-slate-400 pt-2">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-purple-400 font-semibold hover:underline"
            >
              Register free
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
 