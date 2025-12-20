import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'

const publicRoutes = ['/', '/login', '/sign-in', '/sign-up', '/api/auth']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next()
  }

  // Allow API auth routes
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }

  // Check for auth token (support both cookie names for backward compatibility)
  const token = request.cookies.get('auth_token')?.value || request.cookies.get('auth-token')?.value

  if (!token) {
    // Redirect to login if not authenticated
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Verify token
  try {
    jwt.verify(token, JWT_SECRET)
    return NextResponse.next()
  } catch {
    // Invalid token, redirect to login
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
