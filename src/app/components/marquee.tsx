'use client';

import React, { useEffect, useState } from 'react';
import MarqueeText from 'react-marquee-text';
import 'react-marquee-text/dist/styles.css';
import Link from 'next/link';

interface MarqueeNewsItem {
  id?: string;
  title: string;
}

interface MarqueeProps {
  initialNews?: MarqueeNewsItem[];
}

export default function Marquee({ initialNews = [] }: MarqueeProps) {
  const [fetchedNews, setFetchedNews] = useState<MarqueeNewsItem[]>([]);
  const [loading, setLoading] = useState(initialNews.length === 0);

  const news = initialNews.length > 0 ? initialNews : fetchedNews;

  useEffect(() => {
    if (initialNews.length > 0) {
      return;
    }

    let isMounted = true;
    fetch('/api/marquee')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && Array.isArray(data?.data) && data.data.length > 0) {
          setFetchedNews(data.data);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch marquee news:', error);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialNews]);

  if (news.length === 0) {
    if (loading) {
      return (
        <div className="w-full bg-red-700 text-white overflow-hidden py-1 sm:py-1.5 flex items-center">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center w-full">
            <div className="shrink-0 bg-red-800 px-2 sm:px-3.5 py-0.5 sm:py-1 rounded text-[11px] sm:text-sm font-medium flex items-center justify-center mr-2 sm:mr-3 shadow-2xs">
              সর্বশেষ সংবাদ :
            </div>
            <div className="h-4 w-48 bg-red-800/60 rounded animate-pulse" />
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="w-full bg-red-700 text-white overflow-hidden py-1 sm:py-1.5 flex items-center">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center w-full">
        <div className="shrink-0 bg-red-800 px-2 sm:px-3.5 py-0.5 sm:py-1 rounded text-[11px] sm:text-sm font-medium flex items-center justify-center mr-2 sm:mr-3 shadow-2xs">
          সর্বশেষ সংবাদ :
        </div>
        <div className="flex-1 min-w-0 flex items-center overflow-hidden">
          <MarqueeText direction="right" duration={15} pauseOnHover={true}>
            {news.map((h: MarqueeNewsItem, index: number) => {
              const href = h.id ? `/NewsDetail/${h.id}` : '#';
              return (
                <span key={h.id || index} className="inline-block px-3 text-sm sm:text-base">
                  <Link
                    href={href}
                    className="hover:underline transition-opacity hover:opacity-90"
                  >
                    {h.title}
                  </Link>
                  <span className="ml-3 font-semibold opacity-75">•</span>
                </span>
              );
            })}
          </MarqueeText>
        </div>
      </div>
    </div>
  );
}