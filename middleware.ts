export const config = {
  matcher: '/',
};

export default function middleware(request: Request) {
  const url = new URL(request.url);

  // Redirect old WordPress URLs with ?p= parameter to homepage
  if (url.searchParams.has('p') && url.pathname === '/') {
    url.searchParams.delete('p');
    return Response.redirect(url.toString(), 301);
  }

  return new Response(null, {
    headers: request.headers,
  });
}
