"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const SideBarInfo = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const user = session?.user;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "ইউ";
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const [avatarError, setAvatarError] = useState(false);

  return (
    <div className="flex items-center justify-end">
      {isPending ? (
        <div className="h-8 w-20 sm:w-24 bg-gray-100 rounded-full animate-pulse" />
      ) : user ? (
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* User Profile Info Pill */}
          <Link
            href="/profile"
            title="প্রোফাইল দেখুন"
            className="flex items-center gap-1.5 sm:gap-2 py-1 px-2 sm:px-3 bg-gray-50 hover:bg-gray-100/90 border border-gray-200/80 rounded-full transition-all hover:border-[#be1432]/30 active:scale-95 cursor-pointer max-w-[120px] sm:max-w-[190px]"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full ring-1 ring-[#be1432]/30 overflow-hidden flex items-center justify-center bg-red-50 text-[#be1432] text-xs font-bold shrink-0">
              {user.image && !avatarError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-full h-full object-cover rounded-full"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <span>{getInitials(user.name)}</span>
              )}
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-xs sm:text-sm font-semibold text-gray-800 truncate leading-tight">
                {user.name}
              </span>
              <span className="hidden md:inline text-[10px] text-gray-500 truncate leading-tight">
                {user.email}
              </span>
            </div>
          </Link>

          {/* Profile Page Button */}
          <Link
            href="/profile"
            className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200/90 text-gray-700 hover:text-gray-900 border border-gray-200 text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer shadow-2xs shrink-0"
            title="প্রোফাইল পেজে যান"
          >
            <svg
              className="w-3.5 h-3.5 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="hidden sm:inline">প্রোফাইল</span>
          </Link>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-[#be1432] hover:text-[#9d0e26] border border-red-200 text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
            title="সাইন আউট করুন"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="hidden sm:inline">{isSigningOut ? "..." : "লগআউট"}</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <Link
            href="/SignIn"
            className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#be1432] px-2.5 sm:px-3 py-1.5 rounded-full hover:bg-gray-100/80 transition-colors"
          >
            সাইন ইন
          </Link>
          <Link
            href="/SignUp"
            className="bg-[#be1432] hover:bg-[#9d0e26] text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full shadow-xs hover:shadow transition-all active:scale-95"
          >
            সাইন আপ
          </Link>
        </div>
      )}
    </div>
  );
};

export default SideBarInfo;
