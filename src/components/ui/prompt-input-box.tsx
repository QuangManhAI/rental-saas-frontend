'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowUp,
    BrainCog,
    FolderCode,
    Globe,
    Mic,
    Paperclip,
    Square,
    StopCircle,
    X,
} from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { cn } from '@/lib/utils';

// ─── Embedded CSS for scrollbar ──────────────────────────────────────────────
const styles = `
  .prompt-input-box textarea::-webkit-scrollbar { width: 6px; }
  .prompt-input-box textarea::-webkit-scrollbar-track { background: transparent; }
  .prompt-input-box textarea::-webkit-scrollbar-thumb { background-color: rgba(120,120,120,0.4); border-radius: 3px; }
  .prompt-input-box textarea::-webkit-scrollbar-thumb:hover { background-color: rgba(120,120,120,0.6); }
`;

const useStyleInjection = () => {
    React.useEffect(() => {
        const styleId = 'prompt-input-box-styles';
        if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
            const sheet = document.createElement('style');
            sheet.id = styleId;
            sheet.innerText = styles;
            document.head.appendChild(sheet);
        }
    }, []);
};

// ─── Internal Textarea ───────────────────────────────────────────────────────
const PromptTextarea = React.forwardRef<
    HTMLTextAreaElement,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> & { maxHeight?: number }
>(({ className, maxHeight = 160, onChange, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || innerRef;

    React.useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    });

    return (
        <textarea
            ref={textareaRef}
            className={cn(
                'flex min-h-[40px] md:min-h-[44px] w-full resize-none rounded-md border-none bg-transparent px-3 py-1.5 md:py-2.5 text-sm md:text-base placeholder:opacity-50 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
                // Text color adapts to theme
                'text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500',
                className,
            )}
            rows={1}
            onChange={onChange}
            {...props}
        />
    );
});
PromptTextarea.displayName = 'PromptTextarea';

// ─── Custom Divider ──────────────────────────────────────────────────────────
const CustomDivider: React.FC = () => (
    <div className="relative mx-1 h-6 w-[1.5px]">
        <div
            className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-violet-500/50 dark:via-violet-400/50 to-transparent"
            style={{
                clipPath:
                    'polygon(0% 0%, 100% 0%, 100% 40%, 140% 50%, 100% 60%, 100% 100%, 0% 100%, 0% 60%, -40% 50%, 0% 40%)',
            }}
        />
    </div>
);

// ─── Voice Recorder ──────────────────────────────────────────────────────────
interface VoiceRecorderProps {
    isRecording: boolean;
    onStartRecording: () => void;
    onStopRecording: (duration: number) => void;
    visualizerBars?: number;
}
const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
    isRecording,
    onStartRecording,
    onStopRecording,
    visualizerBars = 32,
}) => {
    const [time, setTime] = React.useState(0);
    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        if (isRecording) {
            onStartRecording();
            timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            onStopRecording(time);
            setTime(0);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRecording]);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div
            className={cn(
                'flex w-full flex-col items-center justify-center py-3 transition-all duration-300',
                isRecording ? 'opacity-100' : 'h-0 opacity-0',
            )}
        >
            <div className="mb-3 flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <span className="font-mono text-sm text-slate-700 dark:text-slate-200">{formatTime(time)}</span>
            </div>
            <div className="flex h-10 w-full items-center justify-center gap-0.5 px-4">
                {[...Array(visualizerBars)].map((_, i) => (
                    <div
                        key={i}
                        className="w-0.5 animate-pulse rounded-full bg-slate-400/50 dark:bg-slate-400/50"
                        style={{
                            height: `${Math.max(15, Math.random() * 100)}%`,
                            animationDelay: `${i * 0.05}s`,
                            animationDuration: `${0.5 + Math.random() * 0.5}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

// ─── Main Component ──────────────────────────────────────────────────────────
interface PromptInputBoxProps {
    onSend?: (message: string, files?: File[]) => void;
    isLoading?: boolean;
    onStop?: () => void;
    placeholder?: string;
    className?: string;
}

export const PromptInputBox = React.forwardRef<HTMLDivElement, PromptInputBoxProps>(
    (props, ref) => {
        const {
            onSend = () => { },
            isLoading = false,
            onStop,
            placeholder = 'Hỏi gì đó...',
            className,
        } = props;

        useStyleInjection();

        const [input, setInput] = React.useState('');
        const [files, setFiles] = React.useState<File[]>([]);
        const [filePreviews, setFilePreviews] = React.useState<Record<string, string>>({});
        const [isRecording, setIsRecording] = React.useState(false);
        const [showSearch, setShowSearch] = React.useState(false);
        const [showThink, setShowThink] = React.useState(false);
        const [showCanvas, setShowCanvas] = React.useState(false);
        const uploadInputRef = React.useRef<HTMLInputElement>(null);
        const boxRef = React.useRef<HTMLDivElement>(null);
        const textareaRef = React.useRef<HTMLTextAreaElement>(null);

        const handleToggleChange = (value: string) => {
            if (value === 'search') {
                setShowSearch((p) => !p);
                setShowThink(false);
            } else if (value === 'think') {
                setShowThink((p) => !p);
                setShowSearch(false);
            }
        };
        const handleCanvasToggle = () => setShowCanvas((p) => !p);

        // ── File handling ────────────────────────────────────────────
        const processFile = React.useCallback((file: File) => {
            if (!file.type.startsWith('image/')) return;
            if (file.size > 10 * 1024 * 1024) return;
            setFiles([file]);
            const reader = new FileReader();
            reader.onload = (e) => setFilePreviews({ [file.name]: e.target?.result as string });
            reader.readAsDataURL(file);
        }, []);

        const handleDragOver = React.useCallback((e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
        }, []);

        const handleDrop = React.useCallback(
            (e: React.DragEvent) => {
                e.preventDefault();
                e.stopPropagation();
                const dropped = Array.from(e.dataTransfer.files).filter((f) =>
                    f.type.startsWith('image/'),
                );
                if (dropped[0]) processFile(dropped[0]);
            },
            [processFile],
        );

        const handleRemoveFile = (index: number) => {
            const f = files[index];
            if (f && filePreviews[f.name]) setFilePreviews({});
            setFiles([]);
        };

        // ── Paste handler ────────────────────────────────────────────
        React.useEffect(() => {
            const onPaste = (e: ClipboardEvent) => {
                const items = e.clipboardData?.items;
                if (!items) return;
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item && item.type.startsWith('image/')) {
                        const file = item.getAsFile();
                        if (file) {
                            e.preventDefault();
                            processFile(file);
                            break;
                        }
                    }
                }
            };
            document.addEventListener('paste', onPaste);
            return () => document.removeEventListener('paste', onPaste);
        }, [processFile]);

        // ── Submit handler ───────────────────────────────────────────
        const handleSubmit = () => {
            if (input.trim() || files.length > 0) {
                let prefix = '';
                if (showSearch) prefix = '[Search: ';
                else if (showThink) prefix = '[Think: ';
                else if (showCanvas) prefix = '[Canvas: ';
                const formatted = prefix ? `${prefix}${input}]` : input;
                onSend(formatted, files);
                setInput('');
                setFiles([]);
                setFilePreviews({});
            }
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
            }
        };

        const hasContent = input.trim() !== '' || files.length > 0;

        return (
            <div
                ref={ref || boxRef}
                className={cn(
                    'prompt-input-box rounded-2xl md:rounded-3xl p-1.5 md:p-2 shadow-lg transition-all duration-300',
                    // ── Light mode ──
                    'border border-slate-200 bg-slate-50',
                    // ── Dark mode (synced with page theme) ──
                    'dark:border-slate-600 dark:bg-slate-800 dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]',
                    isLoading && 'border-red-400/70 dark:border-red-500/70',
                    isRecording && 'border-red-400/70 dark:border-red-500/70',
                    className,
                )}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                role="form"
                aria-label="Prompt Input Area"
            >
                {/* ── File previews ─── */}
                {files.length > 0 && !isRecording && (
                    <div className="flex flex-wrap gap-2 p-0 pb-1 transition-all duration-300">
                        {files.map((file, index) => (
                            <div key={index} className="group relative">
                                {file.type.startsWith('image/') && filePreviews[file.name] && (
                                    <div className="h-16 w-16 cursor-pointer overflow-hidden rounded-xl transition-all duration-300">
                                        <Image
                                            src={filePreviews[file.name] || ''}
                                            alt={file.name}
                                            width={64}
                                            height={64}
                                            className="h-full w-full object-cover"
                                            unoptimized
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFile(index);
                                            }}
                                            className="absolute top-1 right-1 rounded-full bg-black/70 p-0.5 opacity-100 transition-opacity"
                                        >
                                            <X className="h-3 w-3 text-white" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Textarea ─── */}
                <div
                    className={cn(
                        'transition-all duration-300',
                        isRecording ? 'h-0 overflow-hidden opacity-0' : 'opacity-100',
                    )}
                >
                    <PromptTextarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading || isRecording}
                        placeholder={
                            showSearch
                                ? 'Tìm kiếm trên web...'
                                : showThink
                                    ? 'Suy nghĩ sâu...'
                                    : showCanvas
                                        ? 'Tạo trên canvas...'
                                        : placeholder
                        }
                        className="text-sm md:text-base"
                    />
                </div>

                {/* ── Voice recorder ─── */}
                {isRecording && (
                    <VoiceRecorder
                        isRecording={isRecording}
                        onStartRecording={() => { }}
                        onStopRecording={(duration) => {
                            setIsRecording(false);
                            onSend(`[Voice message - ${duration} seconds]`, []);
                        }}
                    />
                )}

                {/* ── Action bar ─── */}
                <div className="flex items-center justify-between gap-1 md:gap-2 p-0 pt-1.5 md:pt-2">
                    {/* Left actions */}
                    <div
                        className={cn(
                            'flex items-center gap-1 transition-opacity duration-300',
                            isRecording ? 'invisible h-0 opacity-0' : 'visible opacity-100',
                        )}
                    >
                        {/* Upload */}
                        <button
                            onClick={() => uploadInputRef.current?.click()}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-slate-400 dark:text-slate-400 transition-colors hover:bg-slate-200/60 dark:hover:bg-slate-700/50 hover:text-slate-600 dark:hover:text-slate-200"
                            disabled={isRecording}
                            title="Tải ảnh lên"
                        >
                            <Paperclip className="h-5 w-5 transition-colors" />
                            <input
                                ref={uploadInputRef}
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) processFile(e.target.files[0]);
                                    if (e.target) e.target.value = '';
                                }}
                                accept="image/*"
                            />
                        </button>

                        {/* Toggles container */}
                        <div className="hidden md:flex items-center">
                            {/* Search toggle */}
                            <button
                                type="button"
                                onClick={() => handleToggleChange('search')}
                                className={cn(
                                    'flex h-8 items-center gap-1 rounded-full border px-2 py-1 transition-all',
                                    showSearch
                                        ? 'border-[#1EAEDB] bg-[#1EAEDB]/15 text-[#1EAEDB]'
                                        : 'border-transparent bg-transparent text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200',
                                )}
                            >
                                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                                    <motion.div
                                        animate={{ rotate: showSearch ? 360 : 0, scale: showSearch ? 1.1 : 1 }}
                                        whileHover={{ rotate: showSearch ? 360 : 15, scale: 1.1, transition: { type: 'spring', stiffness: 300, damping: 10 } }}
                                        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                                    >
                                        <Globe className={cn('h-4 w-4', showSearch ? 'text-[#1EAEDB]' : 'text-inherit')} />
                                    </motion.div>
                                </div>
                                <AnimatePresence>
                                    {showSearch && (
                                        <motion.span
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: 'auto', opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex-shrink-0 overflow-hidden whitespace-nowrap text-[#1EAEDB] text-xs"
                                        >
                                            Search
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>

                            <CustomDivider />

                            {/* Think toggle */}
                            <button
                                type="button"
                                onClick={() => handleToggleChange('think')}
                                className={cn(
                                    'flex h-8 items-center gap-1 rounded-full border px-2 py-1 transition-all',
                                    showThink
                                        ? 'border-[#8B5CF6] bg-[#8B5CF6]/15 text-[#8B5CF6]'
                                        : 'border-transparent bg-transparent text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200',
                                )}
                            >
                                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                                    <motion.div
                                        animate={{ rotate: showThink ? 360 : 0, scale: showThink ? 1.1 : 1 }}
                                        whileHover={{ rotate: showThink ? 360 : 15, scale: 1.1, transition: { type: 'spring', stiffness: 300, damping: 10 } }}
                                        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                                    >
                                        <BrainCog className={cn('h-4 w-4', showThink ? 'text-[#8B5CF6]' : 'text-inherit')} />
                                    </motion.div>
                                </div>
                                <AnimatePresence>
                                    {showThink && (
                                        <motion.span
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: 'auto', opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex-shrink-0 overflow-hidden whitespace-nowrap text-[#8B5CF6] text-xs"
                                        >
                                            Think
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>

                            <CustomDivider />

                            {/* Canvas toggle */}
                            <button
                                type="button"
                                onClick={handleCanvasToggle}
                                className={cn(
                                    'flex h-8 items-center gap-1 rounded-full border px-2 py-1 transition-all',
                                    showCanvas
                                        ? 'border-[#F97316] bg-[#F97316]/15 text-[#F97316]'
                                        : 'border-transparent bg-transparent text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200',
                                )}
                            >
                                <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center">
                                    <motion.div
                                        animate={{ rotate: showCanvas ? 360 : 0, scale: showCanvas ? 1.1 : 1 }}
                                        whileHover={{ rotate: showCanvas ? 360 : 15, scale: 1.1, transition: { type: 'spring', stiffness: 300, damping: 10 } }}
                                        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                                    >
                                        <FolderCode className={cn('h-4 w-4', showCanvas ? 'text-[#F97316]' : 'text-inherit')} />
                                    </motion.div>
                                </div>
                                <AnimatePresence>
                                    {showCanvas && (
                                        <motion.span
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: 'auto', opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex-shrink-0 overflow-hidden whitespace-nowrap text-[#F97316] text-xs"
                                        >
                                            Canvas
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                        </div>
                    </div>

                    {/* Right — Send / Stop / Mic */}
                    <button
                        className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200',
                            isLoading
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : isRecording
                                    ? 'bg-transparent text-red-500 hover:bg-slate-200/60 dark:hover:bg-slate-700/50 hover:text-red-400'
                                    : hasContent
                                        ? 'bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:text-white dark:hover:bg-violet-400'
                                        : 'bg-transparent text-slate-400 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-700/50 hover:text-slate-600 dark:hover:text-slate-200',
                        )}
                        onClick={() => {
                            if (isLoading) {
                                onStop?.();
                            } else if (isRecording) {
                                setIsRecording(false);
                            } else if (hasContent) {
                                handleSubmit();
                            } else {
                                setIsRecording(true);
                            }
                        }}
                        title={
                            isLoading
                                ? 'Dừng phản hồi'
                                : isRecording
                                    ? 'Dừng ghi âm'
                                    : hasContent
                                        ? 'Gửi tin nhắn'
                                        : 'Ghi âm'
                        }
                    >
                        {isLoading ? (
                            <Square className="h-4 w-4 animate-pulse fill-white" />
                        ) : isRecording ? (
                            <StopCircle className="h-5 w-5 text-red-500" />
                        ) : hasContent ? (
                            <ArrowUp className="h-4 w-4" />
                        ) : (
                            <Mic className="h-5 w-5 transition-colors" />
                        )}
                    </button>
                </div>
            </div>
        );
    },
);

PromptInputBox.displayName = 'PromptInputBox';
