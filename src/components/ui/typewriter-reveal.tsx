'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface TypewriterRevealProps {
    /** The full text to reveal */
    text: string;
    /** Characters revealed per tick */
    speed?: number;
    /** Milliseconds between ticks */
    intervalMs?: number;
    className?: string;
    cursorClassName?: string;
    /** If true, show cursor while typing */
    showCursor?: boolean;
}

/**
 * One-time typewriter reveal — types out the full text character-by-character
 * with an optional blinking cursor. Once revealed, the cursor fades away.
 */
const TypewriterReveal = React.forwardRef<HTMLSpanElement, TypewriterRevealProps>(
    (
        {
            text,
            speed = 1,
            intervalMs = 20,
            className,
            cursorClassName,
            showCursor = true,
        },
        ref,
    ) => {
        const [displayedCount, setDisplayedCount] = React.useState(0);
        const [done, setDone] = React.useState(false);
        const textRef = React.useRef(text);

        // Reset when text changes (new message)
        React.useEffect(() => {
            if (text !== textRef.current) {
                textRef.current = text;
                setDisplayedCount(0);
                setDone(false);
            }
        }, [text]);

        React.useEffect(() => {
            if (displayedCount >= text.length) {
                setDone(true);
                return;
            }

            const timer = setTimeout(() => {
                setDisplayedCount((prev) => Math.min(prev + speed, text.length));
            }, intervalMs);

            return () => clearTimeout(timer);
        }, [displayedCount, text.length, speed, intervalMs]);

        return (
            <span ref={ref} className={cn('whitespace-pre-wrap', className)}>
                {text.slice(0, displayedCount)}
                {showCursor && !done && (
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{
                            duration: 0.4,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                        className={cn(
                            'ml-0.5 inline-block h-[1em] w-[2px] bg-violet-500 align-text-bottom',
                            cursorClassName,
                        )}
                    />
                )}
            </span>
        );
    },
);
TypewriterReveal.displayName = 'TypewriterReveal';

export { TypewriterReveal };
