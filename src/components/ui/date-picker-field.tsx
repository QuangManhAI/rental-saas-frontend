'use client';

import * as React from 'react';
import { format, parse } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerFieldProps {
    /** Value as YYYY-MM-DD string */
    value?: string;
    /** Callback with YYYY-MM-DD string */
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

/**
 * A date picker that integrates with existing forms expecting YYYY-MM-DD strings.
 * Wraps the shadcn Calendar in a Popover with a trigger button.
 */
export function DatePickerField({
    value,
    onChange,
    placeholder = 'Chọn ngày',
    disabled = false,
    className,
}: DatePickerFieldProps) {
    const [open, setOpen] = React.useState(false);

    const dateValue = React.useMemo(() => {
        if (!value) return undefined;
        try {
            return parse(value, 'yyyy-MM-dd', new Date());
        } catch {
            return undefined;
        }
    }, [value]);

    const handleSelect = (day: Date | undefined) => {
        if (day) {
            onChange?.(format(day, 'yyyy-MM-dd'));
        } else {
            onChange?.('');
        }
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        'w-full justify-start text-left font-normal h-9',
                        !dateValue && 'text-muted-foreground',
                        className,
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateValue ? format(dateValue, 'dd/MM/yyyy', { locale: vi }) : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={handleSelect}
                    captionLayout="dropdown"
                    defaultMonth={dateValue}
                />
            </PopoverContent>
        </Popover>
    );
}
