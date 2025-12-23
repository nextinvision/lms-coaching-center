import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// JWT_SECRET is required for security - no fallbacks allowed
// Get JWT_SECRET at runtime to ensure it's loaded from .env
function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error(
            'JWT_SECRET environment variable is required. Please set it in your .env file and restart the server.'
        );
    }
    return secret;
}

const publicRoutes = ['/', '/login', '/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public pages and all API auth routes to pass through
  if (publicRoutes.includes(pathname) || pathname.startsWith('/api/auth/')) {
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

  // Only check JWT_SECRET when we actually have a token to verify
  try {
    const secret = getJwtSecret()
    const secretKey = new TextEncoder().encode(secret);
    await jwtVerify(token, secretKey);
    return NextResponse.next()
  } catch (error) {
    // If JWT_SECRET is missing, show helpful error only for API routes
    // For pages, redirect to login (user won't see the error)
    if (error instanceof Error && error.message.includes('JWT_SECRET')) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Server configuration error: JWT_SECRET is missing. Please contact administrator.' 
          }, 
          { status: 500 }
        )
      }
      // For pages, just redirect to login (don't expose server errors)
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
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
