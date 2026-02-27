import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

// Routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = ['/login', '/register', '/forgot-password', '/'];

// Assistant Helper : Décodage JWT léger pour l'environnement Edge de Next.js
function parseJwtInfo(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // Décodage sûr supporté par la plupart des plateformes (Vercel, Node, etc.)
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Détecter la locale pour les redirections
    const pathLocale = pathname.split('/')[1];
    const locale = ['fr', 'en'].includes(pathLocale) ? pathLocale : 'fr';

    // Nettoyer l'URL de sa locale pour la vérification
    const pathWithoutLocale = pathname.replace(/^\/(fr|en)/, '');
    const isPublicRoute = publicRoutes.includes(pathWithoutLocale) || pathWithoutLocale === '';

    const token = request.cookies.get('reclamtrack-auth-storage')?.value;

    // 1. Contrôle d'Accès Public / Privé
    if (!isPublicRoute) {
        if (!token) {
            const loginUrl = new URL(`/${locale}/login`, request.url);
            return NextResponse.redirect(loginUrl);
        }

        // 2. RBAC (Role-Based Access Control)
        // Vérification des accès protégés (ex: /admin)
        if (pathWithoutLocale.startsWith('/admin')) {
            const jwtData = parseJwtInfo(token);
            // Si pas de token JWT valide, ou le rôle n'est pas "admin"
            if (!jwtData || (jwtData.role !== 'admin' && jwtData.role !== 'system_admin')) {
                // Rediriger vers un tableau de bord par défaut (interdit)
                const homeUrl = new URL(`/${locale}/dashboard`, request.url);
                return NextResponse.redirect(homeUrl);
            }
        }
    } else if (token && pathWithoutLocale === '/login') {
         // Si l'utilisateur est déjà connecté et visite /login, on le redirige sur dashboard
         const homeUrl = new URL(`/${locale}/dashboard`, request.url);
         return NextResponse.redirect(homeUrl);
    }

    // Appliquer le routage multilingue classique Next-intl ensuite
    return intlMiddleware(request);
}

export const config = {
    matcher: [
        '/((?!api|_next|_vercel|.*\\..*).*)',
        '/',
        '/(fr|en)/:path*'
    ]
};
