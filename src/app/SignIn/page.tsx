import React, { Suspense } from "react";
import Link from "next/link";
import Marquee from "../components/marquee";
import SignInPage from "./SignInForm";

const SignIn = () => {
  return (
    <div className="min-h-full flex flex-col justify-between">
      <div>
        {/* Breaking News Marquee */}
        <Suspense fallback={<div className="h-9 bg-red-700" />}>
          <Marquee />
        </Suspense>
        <div className="w-full max-w-[420px] mx-auto px-4 pt-10 sm:pt-14 pb-12">
          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-bold text-[#be1432] text-center mb-6 sm:mb-8">
            সাইন ইন
          </h1>
          <SignInPage />
          {/* Already have an account */}
          <div className="text-center mt-5 text-xs sm:text-sm text-gray-600">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/SignUp"
              className="text-[#be1432] hover:underline font-semibold ml-0.5"
            >
              সাইন আপ করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
