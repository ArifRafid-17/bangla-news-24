import React from 'react';
import Link from 'next/link';

export interface MostReadArticle {
  id: string;
  title: string;
  description: string | null;
  link: string;
  imageUrl: string | null;
  imageAlt: string | null;
  category: string;
  type: string;
  isLive: boolean;
  firstPublished: string;
  lastPublished: string | null;
  source: string;
  rank: number;
}

interface MostReadPageProps {
  articles?: MostReadArticle[];
}

const MostReadPage = async ({ articles }: MostReadPageProps = {}) => {
  let newsList: MostReadArticle[] = articles || [];

  if (!articles || articles.length === 0) {
    try {
      const res = await fetch("https://news-api-v2.vercel.app/api/news/most-read", {
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const data = await res.json();
        newsList = Array.isArray(data?.data) ? data.data : [];
      }
    } catch (error) {
      console.error("Failed to fetch most-read news:", error);
    }
  }

  if (newsList.length === 0) {
    return null;
  }

  return (
    <aside className="rounded-lg border border-gray-200 bg-white p-4 shadow-xs">
      {/* Header */}
      <h2 className="mb-3 text-lg font-bold text-gray-900 font-serif">
        সর্বাধিক পঠিত
      </h2>

      {/* Numbered List */}
      <ol className="flex flex-col gap-3">
        {newsList.map((item, index) => {
          const rank = item.rank || index + 1;
          return (
            <li key={item.id || index}>
              <Link
                href={`/NewsDetail/${item.id}`}
                className="flex items-start gap-3 group"
              >
                <span className="font-serif font-bold text-xl text-[#be1432]/70 group-hover:text-[#be1432] w-5 shrink-0 leading-tight">
                  {rank}
                </span>
                <span className="font-semibold text-sm leading-snug text-gray-900 group-hover:text-[#be1432] transition-colors flex-1">
                  {item.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </aside>
  );
};

export default MostReadPage;