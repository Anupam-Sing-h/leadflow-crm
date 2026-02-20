import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const pathname = request.nextUrl.pathname

    // Protected routes check
    if (!user && (pathname.startsWith('/admin') || pathname.startsWith('/rep'))) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Role-based protection
    if (user) {
        const role = user.user_metadata?.role as string | undefined

        if (pathname.startsWith('/admin') && role !== 'Admin') {
            const url = request.nextUrl.clone()
            url.pathname = '/rep/dashboard' // Redirect sales rep to their dashboard
            return NextResponse.redirect(url)
        }

        // Optional: if logged in and on login/signup page, redirect to their dashboard
        if (pathname === '/login' || pathname === '/signup') {
            const url = request.nextUrl.clone()
            url.pathname = role === 'Admin' ? '/admin/dashboard' : '/rep/dashboard'
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}
