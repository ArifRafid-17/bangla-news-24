import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface Article {
  id: string;
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  type: 'article' | 'video' | 'audio' | string;
  isLive: boolean;
  firstPublished: string;
  lastPublished: string;
  source: string;
}

export interface SectionData {
  title: string;
  curationId: string;
  curationType: string;
  link: null | string;
  count: number;
  articles: Article[];
}

interface SectionCardProps {
  sectionData?: SectionData;
}

const formatBanglaDate = (dateInput?: string | Date) => {
  if (!dateInput) return "";
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return "";

    const banglaDate = d.toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const banglaTime = d.toLocaleTimeString("bn-BD", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${banglaDate} এ ${banglaTime}`;
  } catch {
    return "";
  }
};
const SectionCardPage = ({ sectionData }: SectionCardProps) => {
  if (!sectionData || !sectionData.articles || sectionData.articles.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      {/* Section Header with red underline */}
      <div className="mb-6 border-b-2 border-[#be1432] pb-2 flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">
          {sectionData.title}
        </h2>
        {sectionData.link && (
          <a
            href={sectionData.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#be1432] hover:underline"
          >
            আরও দেখুন &rarr;
          </a>
        )}
      </div>

      {/* Grid of Article Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sectionData.articles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow group"
          >
            <div>
              {/* Image Container */}
              <Link href={`/NewsDetail/${article.id}`} className="block">
                <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden">
                  {article.imageUrl ? (
                    <Image
                      src={article.imageUrl}
                      alt={article.imageAlt || article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <span className="text-xs">ছবি নেই</span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Article Content */}
              <div className="p-4 sm:p-5">
                <span className="text-xs font-semibold text-[#be1432] block mb-2">
                  {article.category || sectionData.title}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug group-hover:text-[#be1432] transition-colors line-clamp-3">
                  <Link href={`/NewsDetail/${article.id}`}>
                    {article.title}
                  </Link>
                </h3>
                {article.description && (
                  <p className="mt-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
                    {article.description}
                  </p>
                )}
              </div>
            </div>

            {/* Date Footer */}
            <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
              <span suppressHydrationWarning className="text-xs text-gray-400">
                {formatBanglaDate(article.firstPublished || article.lastPublished)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionCardPage;
