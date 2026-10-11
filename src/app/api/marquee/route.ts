import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://news-api-v2.vercel.app/api/news/?limit=10', {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Failed to proxy marquee news:', error);
  }
  return NextResponse.json({ data: [] });
}
