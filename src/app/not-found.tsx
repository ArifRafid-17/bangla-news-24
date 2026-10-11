import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "পৃষ্ঠাটি খুঁজে পাওয়া যায়নি (৪০৪) - Bangla News 24",
  description: "আপনি যে পৃষ্ঠাটি খুঁজছেন তা পাওয়া যায়নি। Bangla News 24 এর মূল পাতায় ফিরে যান।",
};

export default function NotFound() {
  const popularCategories = [
    { title: "বাংলাদেশ", slug: "bangladesh" },
    { title: "রাজনীতি", slug: "politics" },
    { title: "আন্তর্জাতিক", slug: "international" },
    { title: "অর্থনীতি", slug: "business" },
    { title: "খেলা", slug: "sports" },
    { title: "বিনোদন", slug: "entertainment" },
    { title: "বিজ্ঞান ও প্রযুক্তি", slug: "tech" },
  ];

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 sm:py-20 bg-gradient-to-b from-white via-gray-50/50 to-gray-100/30">
      <div className="max-w-xl w-full text-center">
        {/* 404 Badge */}
        <div className="inline-flex items-center justify-center mb-6">
          <div className="relative flex items-center justify-center">
            <span className="font-serif font-black text-7xl sm:text-9xl text-gray-100 tracking-wider select-none">
              ৪০৪
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-red-100/80 text-[#be1432] border border-red-200 shadow-2xs">
                ত্রুটি ৪০৪ • পাতা নেই
              </span>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-4xl font-bold font-serif text-gray-900 leading-tight mb-3">
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-8 max-w-md mx-auto">
          দুঃখিত, আপনি যে লিংকটিতে প্রবেশ করতে চেয়েছেন সেটি পরিবর্তিত হয়েছে অথবা বর্তমানে সরিয়ে নেওয়া হয়েছে।
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#be1432] hover:bg-[#9d0e26] text-white text-sm font-medium px-6 py-3 rounded-lg shadow-xs hover:shadow transition-all active:scale-95"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>হোম পেজে ফিরে যান</span>
          </Link>

          <Link
            href="/MostRead"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium px-6 py-3 rounded-lg border border-gray-300 shadow-2xs hover:border-gray-400 transition-all active:scale-95"
          >
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span>সর্বাধিক পঠিত সংবাদ</span>
          </Link>
        </div>

        {/* Popular Categories */}
        <div className="border-t border-gray-200/80 pt-6">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            জনপ্রিয় বিভাগসমূহ
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {popularCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/Category/${cat.slug}`}
                className="text-xs font-medium text-gray-700 hover:text-[#be1432] bg-white hover:bg-red-50/50 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-full transition-colors shadow-2xs"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
