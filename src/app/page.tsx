import { Suspense } from "react";
import Marquee from "./components/marquee";
import MainNewsPage from "./MainNews/page";
import SectionCardPage, { SectionData } from "./components/SectionCard";
import MostReadPage from "./MostRead/page";



function HomeNewsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aspect-[16/10] bg-gray-200 rounded-lg" />
        <div className="space-y-4">
          <div className="h-16 bg-gray-200 rounded" />
          <div className="h-16 bg-gray-200 rounded" />
          <div className="h-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  let sections: SectionData[] = [];
  try {
    const res = await fetch('https://news-api-v2.vercel.app/api/news/sections', {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      sections = Array.isArray(data?.data) ? data.data : [];
    }
  } catch (error) {
    console.error('Failed to fetch sections:', error);
  }

  const mainNews = sections[0]?.articles || [];
  const excludedKeywords = [
    "হোয়াটসঅ্যাপ",
    "হোয়াটসঅ্যাপ",
    "ইন্সটাগ্রাম",
    "ইনস্টাগ্রাম",
    "সামাজিক মাধ্যমে",
  ];
  const otherSections = sections
    .slice(1)
    .filter((s: SectionData) => !excludedKeywords.some((keyword) => s.title?.includes(keyword)));

  return (
    <div className="min-h-screen bg-white">
      <Marquee />
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main news section */}
          <div className="lg:col-span-2">
            <Suspense fallback={<HomeNewsSkeleton />}>
              <MainNewsPage mainNews={mainNews} />
              <div className="mt-8 sm:mt-12 space-y-8 sm:space-y-12">
                {otherSections.map((os: SectionData, index: number) => (
                  <SectionCardPage key={os.curationId || index} sectionData={os} />
                ))}
              </div>
            </Suspense>
          </div>

          {/* Most read section */}
          <div className="lg:col-span-1">
            <MostReadPage />
          </div>
        </div>
      </div>
    </div>
  );
}
