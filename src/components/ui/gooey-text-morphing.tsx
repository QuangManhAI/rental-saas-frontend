'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface GooeyTextProps {
    texts: string[];
    morphTime?: number;
    cooldownTime?: number;
    className?: string;
    textClassName?: string;
}

export function GooeyText({
    texts,
    morphTime = 1,
    cooldownTime = 0.25,
    className,
    textClassName,
}: GooeyTextProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const [phase, setPhase] = React.useState<'visible' | 'fading-out' | 'fading-in'>('visible');

    React.useEffect(() => {
        if (texts.length <= 1) return;

        const totalCycle = cooldownTime * 1000 + morphTime * 1000;

        const timer = setInterval(() => {
            // Start fading out
            setPhase('fading-out');

            // After fade-out, swap text and fade in
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % texts.length);
                setPhase('fading-in');

                // After fade-in, mark as visible
                setTimeout(() => {
                    setPhase('visible');
                }, (morphTime * 1000) / 2);
            }, (morphTime * 1000) / 2);
        }, totalCycle);

        return () => clearInterval(timer);
    }, [texts, morphTime, cooldownTime]);

    return (
        <div className={cn('relative flex items-center justify-center', className)}>
            <span
                className={cn(
                    'inline-block select-none text-center transition-all',
                    textClassName,
                )}
                style={{
                    transitionDuration: `${(morphTime / 2) * 1000}ms`,
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: phase === 'fading-out' ? 0 : 1,
                    transform: phase === 'fading-out'
                        ? 'translateY(-8px) scale(0.97)'
                        : phase === 'fading-in'
                            ? 'translateY(0) scale(1)'
                            : 'translateY(0) scale(1)',
                    filter: phase === 'fading-out' ? 'blur(4px)' : 'blur(0px)',
                }}
            >
                {texts[currentIndex]}
            </span>
        </div>
    );
}
