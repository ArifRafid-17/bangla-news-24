'use client';

import React, { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import SideBarInfo from "./SideBarInfo";

const emptySubscribe = () => () => {};

function getBanglaDate() {
  try {
    const now = new Date();
    return now.toLocaleDateString("bn-BD", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function Navbar() {
  const banglaDate = useSyncExternalStore(emptySubscribe, getBanglaDate, () => "");

  return (
    <header className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Logo & Date */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <Image
              src="/logo.webp"
              alt="Bangla News 24"
              width={40}
              height={40}
              priority
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-lg transition-transform duration-200 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg sm:text-2xl text-[#be1432] leading-tight tracking-tight">
                Bangla News 24
              </span>
              <span
                suppressHydrationWarning
                className="text-[10px] sm:text-xs text-gray-500 leading-tight mt-0.5"
              >
                {banglaDate || "\u00A0"}
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Auth & User Actions */}
        <div className="flex items-center shrink-0">
          <SideBarInfo />
        </div>
      </div>
    </header>
  );
}
