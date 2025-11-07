import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Redirect old WordPress URLs with ?p= parameter to homepage
  if (url.searchParams.has('p') && url.pathname === '/') {
    url.searchParams.delete('p');
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
