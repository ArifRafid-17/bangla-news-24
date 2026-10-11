import React, { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { connection } from 'next/server';

interface Article {
  id: string;
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  imageAlt: string;
  category: string;
  type: string;
  isLive: boolean;
  firstPublished: string;
  lastPublished: string;
  source: string;
}

interface CategoryApiResponse {
  success: boolean;
  count: number;
  slug: string;
  title: string;
  page: number;
  pageCount: number;
  data: Article[];
}

interface CategoryPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const res = await fetch(`https://news-api-v2.vercel.app/api/category/${id}?page=1`);
    if (res.ok) {
      const categoryData = await res.json();
      const title = categoryData?.title || id;
      return {
        title: `${title} - Bangla News 24`,
        description: `${title} বিভাগের সর্বশেষ খবর ও সংবাদ। দেশ-বিদেশের সংবাদ সবার আগে।`,
      };
    }
  } catch {}
  return {
    title: `সংবাদ বিভাগ - Bangla News 24`,
  };
}

const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBanglaNum = (num: number | string) =>
  String(num).replace(/\d/g, (digit) => banglaDigits[Number(digit)]);

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

const CategorySkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="mb-6 border-b-2 border-[#be1432] pb-2 flex items-center justify-between">
        <div className="h-8 w-40 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between overflow-hidden rounded-lg border border-gray-200 bg-white"
          >
            <div>
              <div className="aspect-[16/9] w-full bg-gray-200"></div>
              <div className="p-4 sm:p-5 space-y-3">
                <div className="h-3 w-16 bg-gray-200 rounded"></div>
                <div className="h-5 w-full bg-gray-200 rounded"></div>
                <div className="h-5 w-4/5 bg-gray-200 rounded"></div>
                <div className="h-3 w-full bg-gray-100 rounded mt-2"></div>
              </div>
            </div>
            <div className="px-4 pb-4 sm:px-5 sm:pb-5">
              <div className="h-3 w-28 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CategoryContent = async ({ params, searchParams }: CategoryPageProps) => {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams?.page || "1", 10) || 1;

  let categoryData: CategoryApiResponse | null = null;
  try {
    const res = await fetch(
      `https://news-api-v2.vercel.app/api/category/${id}?page=${currentPage}`,
      {
        next: { revalidate: 60 },
      }
    );
    if (res.ok) {
      categoryData = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch category news:", error);
  }

  const news: Article[] = categoryData?.data || [];
  const title = categoryData?.title || id;
  const pageCount = categoryData?.pageCount || 1;

  return (
    <>
      <div className="mb-6 border-b-2 border-[#be1432] pb-2 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif">
          {title}
        </h1>
        <span className="text-sm text-gray-500 font-medium">
          পাতা {toBanglaNum(currentPage)} / {toBanglaNum(pageCount)}
        </span>
      </div>

      {news.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          এই বিভাগে কোনো সংবাদ পাওয়া যায়নি।
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col justify-between overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xs transition hover:border-red-300 hover:shadow-md"
              >
                <div>
                  <Link href={`/NewsDetail/${item.id}`} className="block">
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.imageAlt || item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <span className="text-xs">ছবি নেই</span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4 sm:p-5">
                    <span className="mb-1 block text-xs font-semibold text-[#be1432]">
                      {item.category || title}
                    </span>
                    <h2 className="font-bold text-base sm:text-lg leading-snug text-gray-900 transition-colors group-hover:text-[#be1432] line-clamp-2">
                      <Link href={`/NewsDetail/${item.id}`}>
                        {item.title}
                      </Link>
                    </h2>
                    {item.description && (
                      <p className="mt-2 line-clamp-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
                  <span suppressHydrationWarning className="text-xs text-gray-400">
                    {formatBanglaDate(item.firstPublished || item.lastPublished)}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {pageCount > 1 && (
            <nav className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6 text-sm font-medium">
              {currentPage > 1 ? (
                <Link
                  href={`/Category/${id}?page=${currentPage - 1}`}
                  className="rounded border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-50"
                >
                  পূর্ববর্তী
                </Link>
              ) : (
                <span className="cursor-not-allowed rounded border border-gray-200 px-4 py-2 text-gray-300">
                  পূর্ববর্তী
                </span>
              )}

              <span className="text-gray-500 font-medium">
                পাতা {toBanglaNum(currentPage)} / {toBanglaNum(pageCount)}
              </span>

              {currentPage < pageCount ? (
                <Link
                  href={`/Category/${id}?page=${currentPage + 1}`}
                  className="rounded border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-50"
                >
                  পরবর্তী
                </Link>
              ) : (
                <span className="cursor-not-allowed rounded border border-gray-200 px-4 py-2 text-gray-300">
                  পরবর্তী
                </span>
              )}
            </nav>
          )}
        </>
      )}
    </>
  );
};

const Connection = async () => {
  await connection();
  return null;
};

function DynamicMarker() {
  return (
    <Suspense>
      <Connection />
    </Suspense>
  );
}

const CategoryPage = ({ params, searchParams }: CategoryPageProps) => {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        <DynamicMarker />
        <Suspense fallback={<CategorySkeleton />}>
          <CategoryContent params={params} searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
};

export default CategoryPage;