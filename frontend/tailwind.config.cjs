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
                // Brand colors
                primary: {
                    DEFAULT: '#137fec',
                    light: '#4b9fff',
                    dark: '#0e63b8',
                },
                secondary: {
                    DEFAULT: 'var(--color-secondary)',
                    light: 'var(--color-secondary-light)',
                    dark: 'var(--color-secondary-dark)',
                },
                brand: {
                    black: 'var(--ink-black)',
                    teal: 'var(--dark-teal)',
                    cyan: 'var(--dark-cyan)',
                    aqua: 'var(--pearl-aqua)',
                    vanilla: 'var(--vanilla-custard)',
                    orange: 'var(--golden-orange)',
                    caramel: 'var(--burnt-caramel)',
                    spice: 'var(--rusty-spice)',
                    iron: 'var(--oxidized-iron)',
                    red: 'var(--brown-red)',
                    // Legacy overrides
                    deepBlue: '#0A0E17',
                    midnight: '#020617',
                },
                "background-light": "#f6f7f8",
                "background-dark": "#101922",
                "surface-dark": "#1A2633",
                "border-dark": "#2A2F38",
                "accent-red": 'var(--oxidized-iron)',
                "accent-green": 'var(--color-success)',
                "accent-orange": 'var(--golden-orange)',
                "danger": 'var(--color-error)',
                success: {
                    DEFAULT: 'var(--color-success)',
                    light: 'var(--color-success-light)',
                    dark: 'var(--color-success-dark)',
                },
                warning: {
                    DEFAULT: 'var(--color-warning)',
                    light: 'var(--color-warning-light)',
                    dark: 'var(--color-warning-dark)',
                },
                error: {
                    DEFAULT: 'var(--color-error)',
                    light: 'var(--color-error-light)',
                    dark: 'var(--color-error-dark)',
                },
                info: {
                    DEFAULT: 'var(--color-info)',
                    light: 'var(--color-info-light)',
                    dark: 'var(--color-info-dark)',
                },
                // Status colors
                status: {
                    new: 'var(--status-new)',
                    assigned: 'var(--status-assigned)',
                    progress: 'var(--status-progress)',
                    resolved: 'var(--status-resolved)',
                    closed: 'var(--status-closed)',
                    urgent: 'var(--status-urgent)',
                },
                // Background & foreground
                background: 'hsl(var(--background) / <alpha-value>)',
                foreground: 'hsl(var(--foreground) / <alpha-value>)',
                // Card
                card: {
                    DEFAULT: 'hsl(var(--card) / <alpha-value>)',
                    foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
                },
                // Popover
                popover: {
                    DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
                    foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
                },
                // Muted
                muted: {
                    DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
                    foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
                },
                // Accent
                accent: {
                    DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
                    foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
                },
                // Border & input
                border: 'hsl(var(--border) / <alpha-value>)',
                input: 'hsl(var(--input) / <alpha-value>)',
                ring: 'hsl(var(--ring) / <alpha-value>)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
                display: ["Sora", "Inter", "sans-serif"],
            },
            borderRadius: {
                sm: 'var(--radius-sm)',
                DEFAULT: 'var(--radius)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
            },
            boxShadow: {
                sm: 'var(--shadow-sm)',
                DEFAULT: 'var(--shadow)',
                md: 'var(--shadow-md)',
                lg: 'var(--shadow-lg)',
                xl: 'var(--shadow-xl)',
            },
            transitionDuration: {
                fast: 'var(--transition-fast)',
                DEFAULT: 'var(--transition-base)',
                slow: 'var(--transition-slow)',
            },
            animation: {
                'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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

