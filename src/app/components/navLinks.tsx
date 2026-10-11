import Link from 'next/link';
import React from 'react';

interface Category {
    title: string;
    slug: string;
    scrapable: boolean;
}

interface CategoriesApiResponse {
    data: Category[];
}

const defaultCategories: Category[] = [
  { title: "বাংলাদেশ", slug: "bangladesh", scrapable: true },
  { title: "আন্তর্জাতিক", slug: "international", scrapable: true },
  { title: "রাজনীতি", slug: "politics", scrapable: true },
  { title: "অর্থনীতি", slug: "business", scrapable: true },
  { title: "খেলা", slug: "sports", scrapable: true },
  { title: "বিনোদন", slug: "entertainment", scrapable: true },
  { title: "বিজ্ঞান ও প্রযুক্তি", slug: "tech", scrapable: true },
  { title: "জীবনযাপন", slug: "lifestyle", scrapable: true },
];

const NavLinks = async () => {
  let navs: Category[] = defaultCategories;

  try {
    const res = await fetch("https://news-api-v2.vercel.app/api/categories", {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data: CategoriesApiResponse = await res.json();
      if (Array.isArray(data?.data)) {
        const filtered = data.data.filter((n: Category) => n.scrapable);
        if (filtered.length > 0) {
          navs = filtered;
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }

  return (
    <nav className="w-full border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 sm:gap-3 md:gap-5 text-xs sm:text-sm font-medium text-gray-700 py-1.5 overflow-x-auto scrollbar-none whitespace-nowrap justify-start sm:justify-center">
          <Link
            href="/"
            className="px-2.5 py-1 rounded-md hover:text-[#be1432] hover:bg-red-50/50 transition-colors shrink-0"
          >
            হোম
          </Link>
          {navs.map((n: Category) => (
            <Link
              key={n.slug}
              href={`/Category/${n.slug}`}
              className="px-2.5 py-1 rounded-md hover:text-[#be1432] hover:bg-red-50/50 transition-colors shrink-0"
            >
              {n.title}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavLinks;