export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/wellness/:path*',
    '/api/user/:path*'
  ]
};
