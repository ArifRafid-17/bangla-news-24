'use client';
import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import Marquee from '../components/marquee';
import { authClient } from '@/lib/auth-client';
import ProfileHeader from './ProfileHeader';
import ProfileInfoForm from './ProfileInfoForm';
import PasswordChangeForm from './PasswordChangeForm';

export default function ProfilePage() {
  const { data: session, isPending, refetch } = authClient.useSession();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const user = session?.user;

  return (
    <div className="min-h-full flex flex-col justify-between bg-[#fbfbfb]">
      <div>
        {/* Breaking News Marquee */}
        <Suspense fallback={<div className="h-9 bg-red-700" />}>
          <Marquee />
        </Suspense>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
            <Link href="/" className="hover:text-[#be1432] transition-colors">
              হোম
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">আমার প্রোফাইল</span>
          </nav>

          {isPending ? (
            /* Skeleton Loading State */
            <div className="space-y-6">
              <div className="h-44 bg-gray-200/80 rounded-2xl animate-pulse" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80 bg-gray-200/80 rounded-xl animate-pulse" />
                <div className="h-80 bg-gray-200/80 rounded-xl animate-pulse" />
              </div>
            </div>
          ) : !user ? (
            /* Unauthenticated State */
            <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center max-w-md mx-auto shadow-xs my-8">
              <div className="w-16 h-16 rounded-full bg-red-50 text-[#be1432] mx-auto flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                সাইন ইন আবশ্যক
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                আপনার প্রোফাইল দেখতে এবং তথ্য আপডেট করতে অনুগ্রহ করে সাইন ইন করুন।
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/SignIn"
                  className="w-full sm:w-auto bg-[#be1432] hover:bg-[#9d0e26] text-white font-medium py-2.5 px-6 rounded-lg text-sm shadow-xs transition-all"
                >
                  সাইন ইন করুন
                </Link>
                <Link
                  href="/SignUp"
                  className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-6 rounded-lg text-sm transition-all"
                >
                  নতুন একাউন্ট খুলুন
                </Link>
              </div>
            </div>
          ) : (
            /* Authenticated Profile Content */
            <div>
              {/* Profile Header Banner with Toggle Button */}
              <ProfileHeader
                user={user}
                showPasswordForm={showPasswordForm}
                onTogglePassword={() => setShowPasswordForm((prev) => !prev)}
              />

              {showPasswordForm ? (
                /* 2-Column Mode: Personal Info + Password Form */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <ProfileInfoForm
                    key={`${user.email}-${user.name}-${user.image || ''}`}
                    user={user}
                    onUpdateSuccess={() => {
                      refetch();
                    }}
                  />
                  <PasswordChangeForm
                    onClose={() => setShowPasswordForm(false)}
                  />
                </div>
              ) : (
                /* Focused Mode: Personal Info + Password Change Banner Toggle */
                <div className="max-w-2xl mx-auto space-y-6">
                  <ProfileInfoForm
                    key={`${user.email}-${user.name}-${user.image || ''}`}
                    user={user}
                    onUpdateSuccess={() => {
                      refetch();
                    }}
                  />

                  {/* Toggle Card Prompt */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-xl border border-gray-200/90 shadow-2xs">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-lg bg-red-50 text-[#be1432] flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">
                          পাসওয়ার্ড পরিবর্তন করতে চান?
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          আপনার একাউন্টের নিরাপত্তা নিশ্চিত করতে পাসওয়ার্ড পরিবর্তন করুন।
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowPasswordForm(true)}
                      className="inline-flex items-center justify-center gap-2 bg-[#be1432] hover:bg-[#9d0e26] text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-lg shadow-2xs hover:shadow transition-all active:scale-95 cursor-pointer shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      <span>পাসওয়ার্ড পরিবর্তন করুন</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}