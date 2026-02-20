import { createServerClient } from '@supabase/ssr'
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
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isPublicContractRoute =
    pathname === '/contratos/vehicular' ||
    pathname === '/contratos/pago/callback' ||
    pathname === '/contratos/pago/exito' ||
    /^\/contratos\/[^/]+\/pago$/.test(pathname)

  if (
    !user &&
    (pathname.startsWith('/dashboard') ||
      (pathname.startsWith('/contratos') && !isPublicContractRoute) ||
      pathname.startsWith('/perfil') ||
      pathname.startsWith('/documentos') ||
      pathname.startsWith('/suscripcion'))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/iniciar-sesion'
    return NextResponse.redirect(url)
  }

  if (
    user &&
    (pathname.startsWith('/iniciar-sesion') || pathname.startsWith('/registro'))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
