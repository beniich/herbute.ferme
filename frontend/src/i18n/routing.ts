import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'fr', 'ar', 'es', 'pt', 'de', 'tr'],

    // Used when no locale matches
    defaultLocale: 'en',
    
    // Disable automatic locale detection to always force English as default
    localeDetection: false
});
