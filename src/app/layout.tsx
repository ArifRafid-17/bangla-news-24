import type { Metadata, Viewport } from "next";
import { Noto_Serif_Bengali, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "./components/navbar";
import NavLinks from "./components/navLinks";
import Footer from "./components/footer";

const notoSerifBengali = Noto_Serif_Bengali({
  variable: "--font-noto-serif-bengali",
  subsets: ["bengali", "latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Bangla News 24 - সর্বশেষ খবর ও সংবাদ",
  description: "Bangla News 24 - দেশের ও বিদেশের সর্বশেষ ব্রেকিং নিউজ, রাজনীতি, বাণিজ্য, বিনোদন এবং খেলার খবর।",
  icons: {
    icon: "/logo.webp",
  },
};

function NavLinksFallback() {
  return (
    <div className="w-full border-t border-gray-100 bg-white py-2">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-4 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      data-theme="light"
      className={`${notoSerifBengali.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className={`${notoSerifBengali.className} min-h-full flex flex-col bg-[#f8fafc] text-slate-900`}
      >
        <div className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-2xs">
          <Navbar />
          <Suspense fallback={<NavLinksFallback />}>
            <NavLinks />
          </Suspense>
        </div>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
