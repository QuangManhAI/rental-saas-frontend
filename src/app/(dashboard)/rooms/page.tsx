'use client';

import Link from 'next/link';
import { useRooms, useDeleteRoom } from '@/hooks/use-rooms';
import { useProperties } from '@/hooks/use-properties';
import { PageHeader, EmptyState, LoadingSkeleton, ConfirmDialog, StatusBadge } from '@/components/shared';
import { ROUTES } from '@/constants';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, Eye, Pencil, LayoutGrid, List, DoorOpen } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { RoomStatus } from '@/types/enums';
import type { Room } from '@/types';

type ViewMode = 'grid' | 'list';

const STATUS_CONFIG: Record<RoomStatus, { label: string; border: string; badge: string }> = {
  [RoomStatus.AVAILABLE]: {
    label: 'Trống',
    border: 'border-l-green-500',
    badge: 'bg-green-100 text-green-700',
  },
  [RoomStatus.OCCUPIED]: {
    label: 'Đang thuê',
    border: 'border-l-blue-500',
    badge: 'bg-blue-100 text-blue-700',
  },
  [RoomStatus.MAINTENANCE]: {
    label: 'Bảo trì',
    border: 'border-l-yellow-500',
    badge: 'bg-yellow-100 text-yellow-700',
  },
};

function RoomCard({
  room,
  onDelete,
  deleteLoading,
}: {
  room: Room;
  onDelete: () => void;
  deleteLoading: boolean;
}) {
  const cfg = STATUS_CONFIG[room.status] ?? STATUS_CONFIG[RoomStatus.AVAILABLE];

  return (
    <Card className={cn('border-l-4 flex flex-col', cfg.border)}>
      <CardContent className="pt-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <DoorOpen className="h-4 w-4 text-slate-400 shrink-0" />
            <p className="font-semibold text-slate-900 leading-tight">{room.name}</p>
          </div>
          <span
            className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full shrink-0',
              cfg.badge,
            )}
          >
            {cfg.label}
          </span>
        </div>
        <p className="mt-3 text-xl font-bold text-indigo-600">
          {formatCurrency(room.price)}
          <span className="text-xs font-normal text-slate-500">/tháng</span>
        </p>
        {room.area && (
          <p className="text-sm text-slate-500 mt-1">{room.area} m²</p>
        )}
        {room.description && (
          <p className="text-xs text-slate-400 mt-2 line-clamp-2">
            {room.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="border-t pt-3 pb-3 flex items-center justify-end gap-1">
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.ROOM_DETAIL(room._id)}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href={ROUTES.ROOM_EDIT(room._id)}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
        <ConfirmDialog onConfirm={onDelete} loading={deleteLoading} />
      </CardFooter>
    </Card>
  );
}

export default function RoomsPage() {
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { t } = useTranslation();

  const { data: properties } = useProperties();
  const { data, isLoading } = useRooms(
    propertyFilter === 'all' ? undefined : propertyFilter,
  );
  const deleteMut = useDeleteRoom();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('rooms.title')}
        description={t('rooms.description')}
        actionLabel={t('rooms.addRoom')}
        actionHref={ROUTES.ROOM_NEW}
        actionIcon={Plus}
      />

      {/* Filters + view toggle */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={propertyFilter} onValueChange={setPropertyFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder={t('rooms.filterByProperty')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('rooms.allProperties')}</SelectItem>
            {properties?.map((p) => (
              <SelectItem key={p._id} value={p._id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-1 border rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-7 w-7"
            onClick={() => setViewMode('grid')}
            title={t('rooms.viewGrid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-7 w-7"
            onClick={() => setViewMode('list')}
            title={t('rooms.viewList')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : !data?.length ? (
        <EmptyState description={t('rooms.noRooms')} />
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((r) => (
            <RoomCard
              key={r._id}
              room={r}
              onDelete={() => deleteMut.mutate(r._id)}
              deleteLoading={deleteMut.isPending}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('rooms.roomName')}</TableHead>
                <TableHead>{t('rooms.rent')}</TableHead>
                <TableHead>{t('rooms.area')}</TableHead>
                <TableHead>{t('rooms.status')}</TableHead>
                <TableHead className="w-[120px]">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((r) => (
                <TableRow key={r._id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{formatCurrency(r.price)}</TableCell>
                  <TableCell>{r.area ? `${r.area} m²` : '—'}</TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={ROUTES.ROOM_DETAIL(r._id)}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={ROUTES.ROOM_EDIT(r._id)}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <ConfirmDialog
                        onConfirm={() => deleteMut.mutate(r._id)}
                        loading={deleteMut.isPending}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
