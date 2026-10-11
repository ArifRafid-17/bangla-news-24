'use client';

import React, { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

interface ProfileInfoFormProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  onUpdateSuccess?: () => void;
}

export default function ProfileInfoForm({ user, onUpdateSuccess }: ProfileInfoFormProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name || '');
  const [image, setImage] = useState(user.image || '');
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);
    setLoading(true);

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim(),
      });

      if (error) {
        setStatusMessage({
          type: 'error',
          text: error.message || 'তথ্য আপডেট করতে ব্যর্থ হয়েছে',
        });
      } else {
        setStatusMessage({
          type: 'success',
          text: 'প্রোফাইলের তথ্য সফলভাবে আপডেট করা হয়েছে!',
        });
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'একটি অপ্রত্যাশিত ত্রুটি ঘটেছে',
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (str: string) => {
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return str.slice(0, 2).toUpperCase() || 'ইউ';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-5 sm:p-6 transition-all hover:shadow-xs">
      <div className="flex items-center gap-3 pb-4 mb-5 border-b border-gray-100">
        <div className="w-9 h-9 rounded-lg bg-red-50 text-[#be1432] flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
            ব্যক্তিগত তথ্য
          </h2>
          <p className="text-xs text-gray-500">আপনার নাম ও প্রোফাইল ছবি পরিবর্তন করুন</p>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 mb-5 text-xs sm:text-sm rounded-lg flex items-center gap-2.5 transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <svg className="w-4 h-4 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Live Avatar Preview */}
      <div className="flex items-center gap-4 p-3.5 bg-gray-50/80 rounded-lg border border-gray-100 mb-5">
        <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-[#be1432]/25 bg-red-100 flex items-center justify-center shrink-0 shadow-2xs">
          {image && !imagePreviewError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt="Avatar Preview"
              className="w-full h-full object-cover"
              onError={() => setImagePreviewError(true)}
              onLoad={() => setImagePreviewError(false)}
            />
          ) : (
            <span className="font-bold text-base text-[#be1432]">
              {getInitials(name || user.name)}
            </span>
          )}
        </div>
        <div className="text-xs">
          <p className="font-semibold text-gray-800">{name || 'আপনার নাম'}</p>
          <p className="text-gray-500 mt-0.5">ছবি প্রিভিউ (URL পরিবর্তন করলে সাথে সাথে দেখতে পাবেন)</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="profile-name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
            পূর্ণ নাম <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="আপনার নাম লিখুন"
            className="w-full px-3.5 py-2.5 text-sm text-gray-800 bg-[#f8fafc] border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#be1432] focus:border-[#be1432] focus:bg-white transition-colors"
          />
        </div>

        {/* Image URL Field */}
        <div>
          <label htmlFor="profile-image" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
            প্রোফাইল ছবি URL
          </label>
          <input
            type="url"
            id="profile-image"
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
              setImagePreviewError(false);
            }}
            placeholder="https://example.com/avatar.jpg"
            className="w-full px-3.5 py-2.5 text-sm text-gray-800 bg-[#f8fafc] border border-gray-300 rounded-lg shadow-2xs focus:outline-none focus:ring-1 focus:ring-[#be1432] focus:border-[#be1432] focus:bg-white transition-colors"
          />
          <p className="text-[11px] text-gray-500 mt-1">
            যেকোনো সরাসরি ইমেজ লিংক (JPG, PNG, WebP) পেস্ট করতে পারেন।
          </p>
        </div>

        {/* Email Field (Read-only) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="profile-email" className="block text-xs sm:text-sm font-medium text-gray-700">
              ইমেইল অ্যাড্রেস
            </label>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
              স্থায়ী
            </span>
          </div>
          <input
            type="email"
            id="profile-email"
            value={user.email}
            disabled
            className="w-full px-3.5 py-2.5 text-sm text-gray-500 bg-gray-100/80 border border-gray-200 rounded-lg cursor-not-allowed select-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#be1432] hover:bg-[#9d0e26] text-white font-medium py-2.5 px-6 rounded-lg text-sm shadow-2xs hover:shadow transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                <span>সংরক্ষণ করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>তথ্য আপডেট করুন</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
