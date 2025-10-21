import {NextRequest, NextResponse} from 'next/server';
import { updateSession, getSession } from '@/app/lib/auth/auth';

export async function middleware(request: NextRequest) {

    const PUBLIC_ROUTES=[
        '/api/auth/login',
        '/api/auth/signup'
    ]

    if(PUBLIC_ROUTES.some(url => url===request.nextUrl.pathname )){
        return NextResponse.next({request});
    }

    if(await getSession()) {
        return await updateSession(request);
    }

    if (request.nextUrl.pathname.startsWith('/pages')) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

}
