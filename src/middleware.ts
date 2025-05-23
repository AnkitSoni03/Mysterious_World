import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (token && (
        url.pathname === '/sign-in' ||
        url.pathname === '/sign-up' ||
        url.pathname === '/verify' ||
        url.pathname === '/'
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If user is not authenticated and trying to access protected pages, redirect to sign-in
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*',
    ]
}