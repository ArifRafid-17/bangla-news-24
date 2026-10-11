'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// Official Google 'G' icon
function GoogleLogo({ className = "w-4 h-4 shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function SignInForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
    };

    try {
      const { error } = await authClient.signIn.email({
        ...user,
        callbackURL: '/',
      });

      if (error) {
        console.log(error.message);
        setErrorMessage(error.message || 'সাইন ইন ব্যর্থ হয়েছে');
      } else {
        console.log('Sign in successful');
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? err.message : 'একটি ত্রুটি ঘটেছে'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err instanceof Error ? err.message : 'গুগল সাইন ইন ব্যর্থ হয়েছে'
      );
      setGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-3 text-xs sm:text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
          {errorMessage}
        </div>
      )}

      {/* Google Sign In Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading || loading}
        className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-gray-50/90 active:bg-gray-100 text-gray-700 font-medium py-2.5 px-4 rounded-md border border-gray-300 shadow-2xs transition-all cursor-pointer text-xs sm:text-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {googleLoading ? (
          <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <GoogleLogo />
        )}
        <span>{googleLoading ? 'অপেক্ষা করুন...' : 'গুগল দিয়ে সাইন ইন করুন'}</span>
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="w-full border-t border-gray-200" />
        <span className="absolute bg-white px-3 text-xs text-gray-400 font-medium">
          অথবা ইমেইল দিয়ে
        </span>
      </div>

      {/* Email & Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5"
          >
            ইমেইল
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3.5 py-2 text-sm text-gray-800 bg-[#f8fafc] border border-gray-300 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-[#be1432] focus:border-[#be1432] focus:bg-white transition-colors"
            autoComplete="email"
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5"
          >
            পাসওয়ার্ড
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-3.5 py-2 text-sm text-gray-800 bg-[#f8fafc] border border-gray-300 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-[#be1432] focus:border-[#be1432] focus:bg-white transition-colors"
            autoComplete="current-password"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full bg-[#be1432] hover:bg-[#a10e28] text-white font-medium py-2.5 px-4 rounded-md transition-colors cursor-pointer text-sm shadow-xs active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'অপেক্ষা করুন...' : 'সাইন ইন'}
          </button>
        </div>
      </form>
    </div>
  );
}