'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export function McLarenLoader() {
    const [isVisible, setIsVisible] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Listen for route changes
        const handleStart = () => setIsVisible(true);
        const handleComplete = () => {
            // Keep visible for a bit longer for smooth animation
            setTimeout(() => setIsVisible(false), 800);
        };

        // Create custom event listeners for route changes
        const handleRouteChange = () => handleStart();

        window.addEventListener('popstate', handleStart);

        // Intercept link clicks
        const handleLinkClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');

            if (link && link.href && !link.target && !link.getAttribute('download')) {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('http') && !href.startsWith('#')) {
                    handleStart();
                }
            }
        };

        document.addEventListener('click', handleLinkClick, true);

        return () => {
            window.removeEventListener('popstate', handleStart);
            document.removeEventListener('click', handleLinkClick, true);
        };
    }, []);

    // Expose manual trigger for programmatic navigation
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).showMcLarenLoader = () => setIsVisible(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).hideMcLarenLoader = () => setIsVisible(false);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            {/* McLaren Car SVG with animation */}
            <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 rounded-lg blur-lg opacity-30 animate-pulse" />

                {/* Car Container */}
                <div className="relative bg-white dark:bg-slate-900 rounded-lg p-8 shadow-2xl">
                    {/* McLaren Car SVG */}
                    <svg
                        viewBox="0 0 200 100"
                        className="w-48 h-24 animate-bounce-custom"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Road line */}
                        <line
                            x1="0"
                            y1="80"
                            x2="200"
                            y2="80"
                            stroke="currentColor"
                            strokeWidth="1"
                            opacity="0.3"
                        />

                        {/* Car body - McLaren shape */}
                        <g>
                            {/* Main body */}
                            <path
                                d="M 40 60 L 50 45 L 70 40 L 130 40 L 150 45 L 160 60 Z"
                                fill="#FF6B35"
                                stroke="#000"
                                strokeWidth="1.5"
                            />

                            {/* Windshield */}
                            <polygon
                                points="60,48 70,42 120,42 130,48"
                                fill="#87CEEB"
                                opacity="0.8"
                                stroke="#000"
                                strokeWidth="1"
                            />

                            {/* Front section (nose) */}
                            <ellipse cx="155" cy="58" rx="8" ry="6" fill="#1a1a1a" />

                            {/* Wheels */}
                            {/* Front wheel */}
                            <circle cx="65" cy="75" r="8" fill="#1a1a1a" stroke="#FFD700" strokeWidth="2" />
                            <circle cx="65" cy="75" r="5" fill="#333" opacity="0.8" />
                            <line x1="63" y1="73" x2="67" y2="77" stroke="#FFD700" strokeWidth="1" />
                            <line x1="67" y1="73" x2="63" y2="77" stroke="#FFD700" strokeWidth="1" />

                            {/* Rear wheel */}
                            <circle cx="135" cy="75" r="8" fill="#1a1a1a" stroke="#FFD700" strokeWidth="2" />
                            <circle cx="135" cy="75" r="5" fill="#333" opacity="0.8" />
                            <line x1="133" y1="73" x2="137" y2="77" stroke="#FFD700" strokeWidth="1" />
                            <line x1="137" y1="73" x2="133" y2="77" stroke="#FFD700" strokeWidth="1" />

                            {/* Racing stripe */}
                            <rect x="95" y="42" width="10" height="28" fill="#FFD700" opacity="0.7" />

                            {/* Speed lines */}
                            <g stroke="#FF6B35" strokeWidth="1.5" opacity="0.6">
                                <line x1="20" y1="55" x2="35" y2="55" strokeDasharray="3,2" />
                                <line x1="15" y1="65" x2="30" y2="65" strokeDasharray="3,2" />
                            </g>
                        </g>

                        {/* McLaren text */}
                        <text
                            x="100"
                            y="95"
                            textAnchor="middle"
                            fontSize="8"
                            fontWeight="bold"
                            fill="currentColor"
                        >
                            McLaren
                        </text>
                    </svg>

                    {/* Loading text */}
                    <div className="mt-6 text-center">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Changement de vitesse en cours...
                        </p>
                        <div className="flex justify-center gap-1.5">
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                    </div>

                    {/* Speed indicator */}
                    <div className="mt-4 text-center">
                        <div className="inline-block">
                            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Vitesse</div>
                            <div className="relative h-2 w-32 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"
                                    style={{
                                        animation: 'slideRight 1s ease-in-out infinite',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ambient animation styles */}
            <style>{`
        @keyframes slideRight {
          0%, 100% { width: 0%; }
          50% { width: 100%; }
        }

        @keyframes bounce-custom {
          0%, 100% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(-5px) translateY(-8px); }
          50% { transform: translateX(0) translateY(0); }
          75% { transform: translateX(5px) translateY(-8px); }
        }
      `}</style>
        </div>
    );
}

/**
 * Hook to manually trigger McLaren loader
 * Usage:
 * const { showLoader, hideLoader } = useMcLarenLoader();
 * 
 * showLoader();
 * // do something
 * hideLoader();
 */
export function useMcLarenLoader() {
    return {
        showLoader: () => {
            if (typeof window !== 'undefined') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (window as any).showMcLarenLoader?.();
            }
        },
        hideLoader: () => {
            if (typeof window !== 'undefined') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (window as any).hideMcLarenLoader?.();
            }
        },
    };
}
