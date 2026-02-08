import { type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { type ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  actionIcon?: LucideIcon;
  onAction?: () => void;
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  actionLabel,
  actionHref,
  actionIcon: Icon,
  onAction,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {actionLabel &&
          (actionHref ? (
            <Button asChild>
              <Link href={actionHref}>
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {actionLabel}
              </Link>
            </Button>
          ) : (
            <Button onClick={onAction}>
              {Icon && <Icon className="mr-2 h-4 w-4" />}
              {actionLabel}
            </Button>
          ))}
        {children}
      </div>
    </div>
  );
}
