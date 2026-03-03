/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './app/**/*.{js,jsx,ts,tsx}'
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // PREMIUM AGRO PALETTE (Matched to design-tokens.css)
                primary: {
                    DEFAULT: '#00A896', /* var(--pearl-aqua) - Teal Primary */
                    light: '#059669',   /* Emerald Success */
                    dark: '#064E3B',    /* Deep Forest Green - Sidebar/Deep Elements */
                },
                secondary: {
                    DEFAULT: '#0284C7', /* var(--dark-cyan) - Professional Blue */
                    light: '#0EA5E9',
                    dark: '#0369A1',
                },
                accent: {
                    DEFAULT: '#F59E0B', /* var(--golden-orange) - Amber Accent */
                    light: '#FBBF24',
                    dark: '#D97706',
                },
                brand: {
                    forest: '#064E3B',
                    teal: '#00A896',
                    amber: '#F59E0B',
                    navy: '#0F172A',
                    vanilla: '#F9FAFB',
                },
                
                // Status colors
                success: '#10B981',
                warning: '#F59E0B',
                error: '#EF4444',
                info: '#3B82F6',

                // Shadcn / Tailwind variables
                background: 'hsl(var(--background) / <alpha-value>)',
                foreground: 'hsl(var(--foreground) / <alpha-value>)',
                card: {
                    DEFAULT: 'hsl(var(--card) / <alpha-value>)',
                    foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
                    foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
                    foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
                },
                border: 'hsl(var(--border) / <alpha-value>)',
                input: 'hsl(var(--input) / <alpha-value>)',
                ring: 'hsl(var(--ring) / <alpha-value>)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Sora', 'Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            borderRadius: {
              'xs': 'var(--radius-xs)',
              'sm': 'var(--radius-sm)',
              'DEFAULT': 'var(--radius-md)',
              'md': 'var(--radius-md)',
              'lg': 'var(--radius-lg)',
              'xl': 'var(--radius-xl)',
              '2xl': 'var(--radius-2xl)',
            },
            boxShadow: {
              'sm': 'var(--shadow-sm)',
              'md': 'var(--shadow-md)',
              'lg': 'var(--shadow-lg)',
              'xl': 'var(--shadow-xl)',
              'premium': 'var(--shadow-premium)',
            },
            animation: {
                'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.2, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-in-left': 'slideInFromLeft 0.5s ease-out',
                'slide-in-right': 'slideInFromRight 0.5s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideInFromLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-2rem)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInFromRight: {
                    '0%': { opacity: '0', transform: 'translateX(2rem)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
        }
    },
    plugins: []
};
