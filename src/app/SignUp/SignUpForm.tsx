'use client';

import React, { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function SignUpForm() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries()) as {
      name: string;
      image: string;
      email: string;
      password: string;
    };

    try {
      const { error } = await authClient.signUp.email({
        ...user,
        callbackURL: '/',
      });

      if (error) {
        console.log(error.message);
        setErrorMessage(error.message || 'সাইন আপ ব্যর্থ হয়েছে');
      } else {
        console.log('Sign up successful');
        router.push('/');
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMessage && (
        <div className="p-3 text-xs sm:text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">
          {errorMessage}
        </div>
      )}

      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5"
        >
          নাম
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-3.5 py-2 text-sm text-gray-800 bg-[#f8fafc] border border-gray-300 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-[#be1432] focus:border-[#be1432] focus:bg-white transition-colors"
          autoComplete="name"
        />
      </div>

      {/* Image Field */}
      <div>
        <label
          htmlFor="image"
          className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5"
        >
          Image
        </label>
        <input
          type="text"
          id="image"
          name="image"
          className="w-full px-3.5 py-2 text-sm text-gray-800 bg-[#f8fafc] border border-gray-300 rounded-md shadow-xs focus:outline-none focus:ring-1 focus:ring-[#be1432] focus:border-[#be1432] focus:bg-white transition-colors"
        />
      </div>

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
          autoComplete="new-password"
        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#be1432] hover:bg-[#a10e28] text-white font-medium py-2.5 px-4 rounded-md transition-colors cursor-pointer text-sm shadow-xs active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? 'অপেক্ষা করুন...' : 'সাইন আপ'}
        </button>
      </div>
    </form>
  );
}
