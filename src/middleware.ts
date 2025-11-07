import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);

  // Redirect old WordPress URLs with ?p= parameter to homepage
  if (url.searchParams.has('p') && url.pathname === '/') {
    return context.redirect('/', 301);
  }

  return next();
});
