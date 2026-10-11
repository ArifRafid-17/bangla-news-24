import React from "react";
import Image from "next/image";
import Link from "next/link";

const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const currentYear = new Date().getFullYear();
const banglaYear = String(currentYear).replace(/\d/g, (d) => banglaDigits[Number(d)] ?? d);

export default function Footer() {

  const categories = [
    { title: "বাংলাদেশ", href: "/Category/bangladesh" },
    { title: "আন্তর্জাতিক", href: "/Category/international" },
    { title: "রাজনীতি", href: "/Category/politics" },
    { title: "অর্থনীতি", href: "/Category/business" },
    { title: "খেলা", href: "/Category/sports" },
    { title: "বিনোদন", href: "/Category/entertainment" },
    { title: "বিজ্ঞান ও প্রযুক্তি", href: "/Category/tech" },
    { title: "জীবনযাপন", href: "/Category/lifestyle" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo.webp"
                alt="Bangla News 24"
                width={36}
                height={36}
                className="w-9 h-9 object-contain rounded-lg bg-white p-0.5"
              />
              <span className="font-serif font-bold text-xl text-white">
                Bangla News 24
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              সর্বশেষ ব্রেকিং নিউজ, দেশ-বিদেশের সংবাদ, রাজনীতি, অর্থনীতি ও খেলার খবর সবার আগে পেতে চোখ রাখুন Bangla News 24 এ।
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p>• সম্পাদক ও প্রকাশক: আরিফ রাফিদ</p>
              <p>• বার্তা ও বাণিজ্যিক কার্যালয়: ঢাকা, বাংলাদেশ</p>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#be1432] pl-2.5">
              সংবাদ বিভাগ
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              {categories.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-slate-400 hover:text-white hover:underline transition-colors"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#be1432] pl-2.5">
              প্রয়োজনীয় লিংক
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-white hover:underline transition-colors">
                  হোম
                </Link>
              </li>
              <li>
                <Link href="/MostRead" className="hover:text-white hover:underline transition-colors">
                  সর্বাধিক পঠিত
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white hover:underline transition-colors">
                  আমার প্রোফাইল
                </Link>
              </li>
              <li>
                <Link href="/SignIn" className="hover:text-white hover:underline transition-colors">
                  সাইন ইন
                </Link>
              </li>
              <li>
                <Link href="/SignUp" className="hover:text-white hover:underline transition-colors">
                  নতুন অ্যাকাউন্ট খুলুন
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#be1432] pl-2.5">
              যোগাযোগ
            </h3>
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#be1432] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>contact@banglanews24.com</span>
              </p>
              <p className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#be1432] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>ঢাকা, বাংলাদেশ</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-800/80 bg-slate-950/70 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-500">
          <p>© {banglaYear} Bangla News 24. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="text-slate-500">
            সত্য ও বস্তুনিষ্ঠ সংবাদের বিশ্বস্ত ঠিকানা।
          </p>
        </div>
      </div>
    </footer>
  );
}
