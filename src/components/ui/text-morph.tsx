'use client';

import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface TextMorphProps {
  children: string;
  className?: string;
  charDuration?: number;
  staggerDelay?: number;
}

/**
 * TextMorph – character-level morphing animation.
 * When `children` text changes, each character animates out/in individually
 * with staggered blur + vertical slide + 3D rotation.
 */
const TextMorph = React.forwardRef<HTMLSpanElement, TextMorphProps>(
  ({ children, className, charDuration = 0.3, staggerDelay = 0.02 }, ref) => {
    const [displayText, setDisplayText] = React.useState(children);
    const [key, setKey] = React.useState(0);

    React.useEffect(() => {
      if (children !== displayText) {
        setKey((k) => k + 1);
        setDisplayText(children);
      }
    }, [children, displayText]);

    return (
      <span
        ref={ref}
        className={cn('relative inline-flex flex-wrap', className)}
      >
        <AnimatePresence mode="popLayout">
          {displayText.split('').map((char, i) => (
            <motion.span
              key={`${key}-${i}-${char}`}
              initial={{ opacity: 0, y: 12, filter: 'blur(6px)', rotateX: -60 }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)', rotateX: 0 }}
              exit={{ opacity: 0, y: -12, filter: 'blur(6px)', rotateX: 60 }}
              transition={{
                duration: charDuration,
                delay: i * staggerDelay,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              className="inline-block"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </AnimatePresence>
      </span>
    );
  },
);

TextMorph.displayName = 'TextMorph';

/**
 * TextMorphCycler – cycles through a list of strings with TextMorph effect.
 * Good for hero text or status displays.
 */
interface TextMorphCyclerProps {
  texts: string[];
  className?: string;
  interval?: number;
  charDuration?: number;
  staggerDelay?: number;
}

const TextMorphCycler = React.forwardRef<HTMLSpanElement, TextMorphCyclerProps>(
  (
    {
      texts,
      className,
      interval = 3000,
      charDuration = 0.4,
      staggerDelay = 0.03,
    },
    ref,
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
      if (texts.length <= 1) return;
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
      }, interval);
      return () => clearInterval(timer);
    }, [interval, texts.length]);

    return (
      <TextMorph
        ref={ref}
        className={className}
        charDuration={charDuration}
        staggerDelay={staggerDelay}
      >
        {texts[currentIndex] || ''}
      </TextMorph>
    );
  },
);

TextMorphCycler.displayName = 'TextMorphCycler';

export { TextMorph, TextMorphCycler };
