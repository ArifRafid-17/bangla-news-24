'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

interface ProfileHeaderProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    createdAt?: string | Date;
  };
  showPasswordForm?: boolean;
  onTogglePassword?: () => void;
}

export default function ProfileHeader({
  user,
  showPasswordForm,
  onTogglePassword,
}: ProfileHeaderProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await authClient.signOut();
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSigningOut(false);
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'ইউ';
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="bg-gradient-to-r from-red-950 via-[#7a0d1e] to-[#be1432] rounded-2xl p-6 sm:p-8 text-white shadow-md mb-8 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute right-20 -bottom-16 w-60 h-60 rounded-full bg-black/10 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {/* User Info */}
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-4 ring-white/20 bg-white/10 shrink-0 flex items-center justify-center shadow-inner">
            {user.image && !imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name || 'User Avatar'}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="font-serif font-bold text-xl sm:text-2xl text-white">
                {getInitials(user.name)}
              </span>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {user.name}
              </h1>
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[11px] font-medium px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                সক্রিয় সদস্য
              </span>
            </div>

            <p className="text-xs sm:text-sm text-red-100/90 font-mono">
              {user.email}
            </p>

            {formattedDate && (
              <p className="text-[11px] sm:text-xs text-red-200/80 mt-1 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>যোগদান: {formattedDate}</span>
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
          {onTogglePassword && (
            <button
              type="button"
              onClick={onTogglePassword}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white border border-white/25 text-xs sm:text-sm font-medium px-4 py-2 rounded-xl transition-all cursor-pointer backdrop-blur-xs"
              title="পাসওয়ার্ড পরিবর্তনের ফর্ম খুলুন বা বন্ধ করুন"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span>{showPasswordForm ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড পরিবর্তন'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="inline-flex items-center gap-2 bg-black/20 hover:bg-black/30 active:bg-black/40 text-white border border-white/15 text-xs sm:text-sm font-medium px-4 py-2 rounded-xl transition-all cursor-pointer backdrop-blur-xs disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>{signingOut ? 'সাইন আউট হচ্ছে...' : 'লগআউট'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
