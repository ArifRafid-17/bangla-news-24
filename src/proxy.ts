import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Protected routes: require authentication
  if (pathname.startsWith('/profile')) {
    if (!sessionCookie) {
      const signInUrl = new URL('/SignIn', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Auth routes: redirect logged-in users away from SignIn/SignUp
  if (pathname === '/SignIn' || pathname === '/SignUp') {
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/SignIn',
    '/SignUp',
  ],
};
