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
                /* ── Palette officielle ───────────────────────── */
                /* #F5FBE6  Soft Mint      */
                /* #215E61  Dark Teal      */
                /* #233D4D  Midnight Blue  */
                /* #FE7F2D  Pumpkin Orange */

                brand: {
                    mint:           '#F5FBE6',
                    'mint-dark':    '#e5f0c8',
                    teal:           '#215E61',
                    'teal-light':   '#2c7a7e',
                    'teal-dark':    '#164143',
                    navy:           '#233D4D',
                    'navy-light':   '#3a5b6d',
                    orange:         '#FE7F2D',
                    'orange-light': '#ff9e5e',
                    'orange-dark':  '#cc5d10',
                },

                primary: {
                    DEFAULT: '#215E61',
                    light:   '#2c7a7e',
                    dark:    '#164143',
                },
                secondary: {
                    DEFAULT: '#233D4D',
                    light:   '#3a5b6d',
                },
                accent: {
                    DEFAULT: '#FE7F2D',
                    light:   '#ff9e5e',
                    dark:    '#cc5d10',
                },

                /* ── Sémantiques ── */
                success: '#10b981',
                warning: '#FE7F2D',
                error:   '#e11d48',
                info:    '#215E61',

                /* ── Shadcn variable mapping ── */
                background:  'hsl(var(--background) / <alpha-value>)',
                foreground:  'hsl(var(--foreground) / <alpha-value>)',
                card: {
                    DEFAULT:    'hsl(var(--card) / <alpha-value>)',
                    foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
                },
                popover: {
                    DEFAULT:    'hsl(var(--popover) / <alpha-value>)',
                    foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
                },
                muted: {
                    DEFAULT:    'hsl(var(--muted) / <alpha-value>)',
                    foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
                },
                border: 'hsl(var(--border) / <alpha-value>)',
                input:  'hsl(var(--input) / <alpha-value>)',
                ring:   'hsl(var(--ring) / <alpha-value>)',
            },

            fontFamily: {
                sans:    ['Inter', 'system-ui', 'sans-serif'],
                display: ['Sora', 'Inter', 'sans-serif'],
                mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
            },

            borderRadius: {
                'xs':  'var(--radius-xs)',
                'sm':  'var(--radius-sm)',
                DEFAULT: 'var(--radius-md)',
                'md':  'var(--radius-md)',
                'lg':  'var(--radius-lg)',
                'xl':  'var(--radius-xl)',
                '2xl': 'var(--radius-2xl)',
            },

            boxShadow: {
                'sm':      'var(--shadow-sm)',
                DEFAULT:   'var(--shadow-md)',
                'md':      'var(--shadow-md)',
                'lg':      'var(--shadow-lg)',
                'xl':      'var(--shadow-xl)',
                'card':    'var(--shadow-card)',
                'premium': 'var(--shadow-premium)',
            },

            animation: {
                'pulse-slow':     'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float':          'float 6s ease-in-out infinite',
                'fade-in':        'fadeIn 0.4s ease-out',
                'slide-up':       'slideUp 0.35s ease-out',
                'slide-in-left':  'slideInFromLeft 0.4s ease-out',
                'slide-in-right': 'slideInFromRight 0.4s ease-out',
            },

            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%':      { transform: 'translateY(-16px)' },
                },
                fadeIn: {
                    '0%':   { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%':   { opacity: '0', transform: 'translateY(12px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInFromLeft: {
                    '0%':   { opacity: '0', transform: 'translateX(-1.5rem)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInFromRight: {
                    '0%':   { opacity: '0', transform: 'translateX(1.5rem)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
            },
        }
    },
    plugins: []
};
