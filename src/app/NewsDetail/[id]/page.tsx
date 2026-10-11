import React, { Suspense } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";

interface BodyBlock {
  type: "image" | "text" | "subheading" | string;
  url?: string;
  width?: number;
  height?: number;
  caption?: string | null;
  altText?: string | null;
  copyrightHolder?: string | null;
  text?: string;
}

type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonValue[]
  | { [key: string]: JsonValue };

interface ArticleDetail {
  id: string;
  title: string;
  description: JsonValue | null;
  link: string;
  firstPublished: string;
  lastPublished: string | null;
  byline: JsonValue | null;
  topics: JsonValue | null;
  tags: JsonValue | null;
  imageUrl: string | null;
  body: BodyBlock[];
  text: string | null;
  wordCount: number | null;
  source: string;
  sourceUrl: string | null;
}

interface NewsDetailPageProps {
  params: Promise<{ id: string }>;
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
      timeZone: "Asia/Dhaka",
    });
    const timeStr = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Dhaka",
    });
    return `${banglaDate} এ ${toBanglaNum(timeStr)}`;
  } catch {
    return "";
  }
};

function extractDescription(desc: JsonValue | null | undefined): string {
  if (!desc) return "";
  if (typeof desc === "string") return desc;
  if (typeof desc === "object") {
    const obj = desc as Record<string, JsonValue>;
    if (typeof obj.text === "string") return obj.text;

    const texts: string[] = [];
    const traverse = (node: JsonValue | undefined): void => {
      if (
        !node ||
        typeof node === "string" ||
        typeof node === "number" ||
        typeof node === "boolean"
      )
        return;

      if (Array.isArray(node)) {
        node.forEach(traverse);
        return;
      }

      const record = node as Record<string, JsonValue>;
      if (typeof record.text === "string" && record.text.trim()) {
        texts.push(record.text.trim());
        return;
      }
      if (record.model) {
        traverse(record.model as JsonValue);
      }
      if (Array.isArray(record.blocks)) {
        record.blocks.forEach(traverse);
      }
    };
    traverse(desc);
    return texts.length > 0 ? texts[0] : "";
  }
  return "";
}

function extractAuthor(byline: JsonValue | null | undefined): string | null {
  if (!byline) return null;
  if (typeof byline === "string") return byline;
  if (Array.isArray(byline) && byline.length > 0) {
    const firstItem = byline[0];
    if (typeof firstItem === "string") return firstItem;
    if (firstItem && typeof firstItem === "object") {
      const authorItem = firstItem as Record<string, JsonValue>;
      if (typeof authorItem.name === "string") return authorItem.name;
    }
  }
  if (typeof byline === "object") {
    const authorObj = byline as Record<string, JsonValue>;
    if (typeof authorObj.name === "string") return authorObj.name;
  }
  return null;
}

function extractTags(article: ArticleDetail): string[] {
  const tagsList =
    Array.isArray(article.tags) && article.tags.length > 0
      ? article.tags
      : Array.isArray(article.topics) && article.topics.length > 0
        ? article.topics
        : [];

  return tagsList
    .map((tag: JsonValue) => {
      if (typeof tag === "string") return tag;
      if (tag && typeof tag === "object") {
        const item = tag as Record<string, JsonValue>;
        return typeof item.name === "string" ? item.name : "";
      }
      return "";
    })
    .filter(Boolean);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const res = await fetch(`https://news-api-v2.vercel.app/api/article/${id}`);
    if (res.ok) {
      const json = await res.json();
      const desc = extractDescription(json.data?.description);
      return {
        title: `${json.data?.title || "সংবাদ বিস্তারিত"} - Bangla News 24`,
        description: desc || "",
      };
    }
  } catch {}
  return {
    title: "সংবাদ বিস্তারিত - Bangla News 24",
  };
}

const NewsDetailSkeleton = () => {
  return (
    <article className="mx-auto max-w-2xl animate-pulse">
      <div className="h-8 sm:h-10 w-full bg-gray-200 rounded mb-2"></div>
      <div className="h-8 sm:h-10 w-3/4 bg-gray-200 rounded mb-4"></div>

      <div className="h-5 w-full bg-gray-200 rounded mb-2"></div>
      <div className="h-5 w-5/6 bg-gray-200 rounded mb-4"></div>

      <div className="flex gap-4 border-y border-neutral-200 py-3 mb-6">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>

      <div className="aspect-[16/9] w-full bg-gray-200 rounded-lg mb-4"></div>

      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-4/5 bg-gray-200 rounded"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
      </div>
    </article>
  );
};

const NewsDetailContent = async ({ params }: NewsDetailPageProps) => {
  const { id } = await params;

  let article: ArticleDetail | null = null;
  try {
    const res = await fetch(
      `https://news-api-v2.vercel.app/api/article/${id}`,
      {
        next: { revalidate: 60 },
      },
    );
    if (res.ok) {
      const json = await res.json();
      article = json.data;
    }
  } catch (error) {
    console.error("Failed to fetch article:", error);
  }

  if (!article) {
    notFound();
  }

  const descriptionText = extractDescription(article.description);
  const author = extractAuthor(article.byline);
  const tags = extractTags(article);

  return (
    <article className="mx-auto max-w-2xl">
      {/* Article Title */}
      <h1 className="text-2xl font-bold leading-snug text-neutral-900 sm:text-3xl">
        {article.title}
      </h1>

      {/* Lead / Description */}
      {descriptionText && (
        <p className="mt-3 text-lg text-neutral-600">{descriptionText}</p>
      )}

      {/* Meta Bar */}
      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 border-y border-neutral-200 py-3 text-sm text-neutral-500">
        {author && <span>{author}</span>}
        <span suppressHydrationWarning>
          {formatBanglaDate(
            article.firstPublished || article.lastPublished || undefined,
          )}
        </span>
        {article.wordCount && <span>{article.wordCount} শব্দ</span>}
      </div>

      {/* Article Body Content */}
      <div className="mt-6">
        <div className="flex flex-col gap-4">
          {article.body && article.body.length > 0
            ? article.body.map((block, index) => {
                if (block.type === "image" && block.url) {
                  return (
                    <figure key={index} className="my-2">
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-neutral-100">
                        <Image
                          src={block.url}
                          alt={block.altText || article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 768px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      {(block.caption || block.copyrightHolder) && (
                        <figcaption className="mt-1 text-sm text-neutral-500">
                          {block.caption}
                          {block.copyrightHolder && (
                            <span> ({block.copyrightHolder})</span>
                          )}
                        </figcaption>
                      )}
                    </figure>
                  );
                }

                if (block.type === "subheading" && block.text) {
                  return (
                    <h2
                      key={index}
                      className="mt-2 text-xl font-bold text-neutral-900"
                    >
                      {block.text}
                    </h2>
                  );
                }

                if (block.type === "text" && block.text) {
                  return (
                    <p key={index} className="leading-relaxed text-neutral-800">
                      {block.text}
                    </p>
                  );
                }

                return null;
              })
            : article.text
              ? article.text.split("\n\n").map((para, i) => (
                  <p key={i} className="leading-relaxed text-neutral-800">
                    {para}
                  </p>
                ))
              : null}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

const NewsDetailPage = ({ params }: NewsDetailPageProps) => {
  return (
    <div className="min-h-screen bg-white">
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6">
        <Suspense fallback={<NewsDetailSkeleton />}>
          <NewsDetailContent params={params} />
        </Suspense>
      </main>
    </div>
  );
};

export default NewsDetailPage;
