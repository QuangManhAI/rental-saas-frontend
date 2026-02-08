import { Badge } from '@/components/ui/badge';
import { getStatusColor } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={getStatusColor(status)}>
      {label ?? status}
    </Badge>
  );
}
