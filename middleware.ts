// middleware.ts 
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('city_auth_token')?.value;
  const role = request.cookies.get('user_role')?.value;
  const path = request.nextUrl.pathname;

  // 1.public pages (login, register, home)if (path === '/login' || path === '/register' || path === '/') {
  if (path === '/login' || path === '/register' || path === '/') {
    if (token && role) {
      if (role === 'CITY_ADMIN' || role === 'DEPARTMENT_MANAGER') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      } else if (role === 'CITIZEN') {
        return NextResponse.redirect(new URL('/citizen/dashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/staff/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // 2. if no token is found, redirect to the login page
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. strict role-based security check (Role-based Protection)
  if (path.startsWith('/admin') && role !== 'CITY_ADMIN' && role !== 'DEPARTMENT_MANAGER') {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }
  
  if (path.startsWith('/citizen') && role !== 'CITIZEN') {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  if (path.startsWith('/staff') && role !== 'DEPARTMENT_STAFF' && role !== 'TECHNICIAN') {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  return NextResponse.next();
}

// which routes the middleware should apply to
export const config = {
  matcher: ['/admin/:path*', '/citizen/:path*', '/staff/:path*', '/login', '/register'],
};