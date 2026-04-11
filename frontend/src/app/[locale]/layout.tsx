import DebugWidget from '@/components/DebugWidget';
import { MiniMcLarenLoader } from '@/components/mini-mclarenloader';
import { NotificationToast } from '@/components/NotificationToast';
import { routing } from '@/i18n/routing';
import { AuthProvider } from '@/providers/AuthProvider';
import { CallProvider } from '@/providers/CallProvider';
import { NotificationProvider } from '@/providers/NotificationProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import '@/styles/globals.css';
import '@/styles/agro-theme.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Sora, Playfair_Display, Outfit, JetBrains_Mono, Anton } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        default: 'Herbute ERP | Gestion Agricole, Industrielle & RH Intelligente',
        template: '%s | Herbute ERP'
    },
    description: 'Le premier ERP dopé à l\'IA locale (Llama3) conçu pour l\'agriculture moderne et la gestion industrielle. Suivez vos stocks, vos équipes, vos récoltes et vos budgets.',
    keywords: ['ERP agricole', 'logiciel de gestion de ferme', 'Sénégal', 'Maroc', 'CRM agriculture', 'gestion RH', 'IA locale', 'Agro-industrie', 'logiciel SaaS'],
    authors: [{ name: 'Herbute Tech', url: 'https://herbute.com' }],
    creator: 'Herbute',
    manifest: '/manifest.json',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Herbute ERP',
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        url: 'https://herbute.com/',
        title: 'Herbute ERP - La révolution intelligente',
        description: 'Pilotez votre ferme ou entreprise industrielle avec une Intelligence Artificielle intégrée et un système de recouvrement automatisé.',
        siteName: 'Herbute ERP'
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Herbute ERP',
        description: 'Pilotez vos opérations avec notre IA de Direction.',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-video-preview': -1,
            'max-snippet': -1,
        },
    },
};

export const viewport = {
    themeColor: '#1a1209',
    width: 'device-width',
    initialScale: 1,
};

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter'
});

const sora = Sora({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-sora'
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-display'
});

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-body'
});

const jetbrains = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono'
});

const anton = Anton({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-anton'
});

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
            <head>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
                />
            </head>
            <body suppressHydrationWarning className={`${inter.variable} ${sora.variable} ${playfair.variable} ${outfit.variable} ${jetbrains.variable} ${anton.variable} font-sans antialiased`}>
                <ThemeProvider>
                    <NextIntlClientProvider messages={messages || {}} locale={locale}>
                        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
                            <QueryProvider>
                                <AuthProvider>
                                    <NotificationProvider>
                                        <CallProvider>
                                            {children}
                                            <NotificationToast />
                                            <DebugWidget />
                                            <MiniMcLarenLoader />
                                        </CallProvider>
                                    </NotificationProvider>
                                </AuthProvider>
                            </QueryProvider>
                        </GoogleOAuthProvider>
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
