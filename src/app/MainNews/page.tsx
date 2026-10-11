'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface props {
  id: string;
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  type: 'article' | 'video' | 'audio' | string;
  isLive: boolean;
  firstPublished: string; // ISO 8601 UTC timestamp
  lastPublished: string;  // ISO 8601 UTC timestamp
  source: string;
}

interface MainNewsProps {
  mainNews: props[];
}

const getBanglaLiveDate = (date?: Date) => {
  if (!date) return '';
  try {
    const banglaDate = date.toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const banglaTime = date.toLocaleTimeString('bn-BD', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${banglaDate} এ ${banglaTime}`;
  } catch {
    return '';
  }
};

const MainNewsPage = ({ mainNews = [] }: MainNewsProps) => {
  const [fetchedNews, setFetchedNews] = useState<props[]>([]);
  const [liveDate, setLiveDate] = useState<string>('');

  const newsList = Array.isArray(mainNews) && mainNews.length > 0 ? mainNews : fetchedNews;

  useEffect(() => {
    const updateTime = () => setLiveDate(getBanglaLiveDate(new Date()));
    updateTime();
    const timer = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (Array.isArray(mainNews) && mainNews.length > 0) {
      return;
    }

    // If accessed directly at /MainNews
    fetch('https://news-api-v2.vercel.app/api/news/sections')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.data?.[0]?.articles) {
          setFetchedNews(data.data[0].articles);
        }
      })
      .catch(() => {});
  }, [mainNews]);

  const articles: props[] = Array.isArray(newsList) ? newsList : [];
  if (articles.length === 0) return null;

  const leadNews = articles[0];
  const sideNews = articles.slice(1, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column: Lead News Card */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
        <div>
          <Link href={`/NewsDetail/${leadNews.id}`} className="block">
            <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden">
              {leadNews.imageUrl ? (
                <Image
                  src={leadNews.imageUrl}
                  alt={leadNews.imageAlt || leadNews.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  priority
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <span>ছবি নেই</span>
                </div>
              )}
            </div>
          </Link>
          <div className="p-5">
            <span className="text-xs font-semibold text-[#be1432] block">
              {leadNews.category || "প্রধান খবর"}
            </span>
            <h2 className="mt-2 text-xl sm:text-2xl font-bold text-gray-900 leading-snug hover:text-[#be1432] transition-colors">
              <Link href={`/NewsDetail/${leadNews.id}`}>
                {leadNews.title}
              </Link>
            </h2>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3">
              {leadNews.description}
            </p>
          </div>
        </div>
        <div className="px-5 pb-5">
          <span suppressHydrationWarning className="text-xs text-gray-400">
            {liveDate}
          </span>
        </div>
      </div>

      {/* Right Column: Side News List Card */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200 overflow-hidden flex flex-col justify-between shadow-xs">
        {sideNews.map((item) => (
          <article
            key={item.id}
            className="p-4 sm:p-5 hover:bg-gray-50/70 transition-colors flex-1 flex flex-col justify-center"
          >
            <span className="text-xs font-semibold text-[#be1432] block mb-1">
              {item.category || "প্রধান খবর"}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug hover:text-[#be1432] transition-colors">
              <Link href={`/NewsDetail/${item.id}`}>
                {item.title}
              </Link>
            </h3>
          </article>
        ))}
      </div>
    </div>
  );
};
export default MainNewsPage;