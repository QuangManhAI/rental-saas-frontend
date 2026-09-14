'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  createNotificationSchema,
  type CreateNotificationFormValues,
} from '@/lib/validators';
import { NotificationType } from '@/types/enums';
import { useCreateNotification } from '@/hooks/use-notifications';
import {
  Bell,
  Wrench,
  Receipt,
  FileText,
  ShieldAlert,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface CreateNotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TEMPLATES = [
  {
    icon: Wrench,
    label: 'Bảo trì hệ thống',
    type: NotificationType.INFO,
    title: 'Thông báo bảo trì hệ thống định kỳ',
    message:
      'Ban quản lý xin thông báo kế hoạch kiểm tra và bảo trì hệ thống tại toà nhà vào cuối tuần này. Quý khách vui lòng lưu ý và sắp xếp sinh hoạt thuận tiện.',
    link: '',
  },
  {
    icon: Receipt,
    label: 'Nhắc đóng tiền phòng',
    type: NotificationType.BILL_DUE,
    title: 'Nhắc nhở hạn nộp tiền phòng & dịch vụ',
    message:
      'Kính gửi quý khách thuê phòng, hoá đơn tháng này đã được phát hành và sắp đến hạn thanh toán. Quý khách vui lòng kiểm tra và thanh toán đúng hạn.',
    link: '/bills',
  },
  {
    icon: ShieldAlert,
    label: 'Nội quy & An ninh',
    type: NotificationType.INFO,
    title: 'Nhắc nhở nội quy toà nhà và an ninh trật tự',
    message:
      'Để đảm bảo an ninh và sự yên tĩnh chung, quý khách vui lòng khoá cổng cẩn thận sau khi ra vào và giữ trật tự chung sau 23:00 hàng ngày. Xin cảm ơn sự hợp tác của quý khách.',
    link: '',
  },
  {
    icon: FileText,
    label: 'Gia hạn hợp đồng',
    type: NotificationType.CONTRACT_EXPIRING,
    title: 'Rà soát và gia hạn hợp đồng thuê phòng',
    message:
      'Hợp đồng thuê phòng sắp hết hạn. Nếu quý khách có nhu cầu tiếp tục gia hạn hoặc có thay đổi kế hoạch, vui lòng liên hệ sớm với ban quản lý để được hỗ trợ.',
    link: '/contracts',
  },
];

export function CreateNotificationDialog({
  open,
  onOpenChange,
}: CreateNotificationDialogProps) {
  const createMutation = useCreateNotification();

  const form = useForm<CreateNotificationFormValues>({
    resolver: zodResolver(createNotificationSchema),
    defaultValues: {
      title: '',
      message: '',
      type: NotificationType.INFO,
      link: '',
    },
  });

  const onSubmit = (data: CreateNotificationFormValues) => {
    createMutation.mutate(
      {
        title: data.title,
        message: data.message,
        type: data.type,
        link: data.link || undefined,
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      },
    );
  };

  const applyTemplate = (template: (typeof TEMPLATES)[number]) => {
    form.setValue('title', template.title, { shouldValidate: true });
    form.setValue('message', template.message, { shouldValidate: true });
    form.setValue('type', template.type, { shouldValidate: true });
    form.setValue('link', template.link, { shouldValidate: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Tạo thông báo mới
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Phát thông báo tới hệ thống và khách thuê nhà trọ
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Quick Templates */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Mẫu thông báo nhanh:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.label}
                type="button"
                onClick={() => applyTemplate(tmpl)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600"
              >
                <tmpl.icon className="h-3 w-3 text-slate-500" />
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Tiêu đề thông báo <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="VD: Thông báo bảo trì điện nước ngày 15/09"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type & Link Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Phân loại
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn loại thông báo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={NotificationType.INFO}>
                          📢 Thông báo chung
                        </SelectItem>
                        <SelectItem value={NotificationType.BILL_DUE}>
                          ⏰ Nhắc hạn hoá đơn
                        </SelectItem>
                        <SelectItem value={NotificationType.NEW_BILL}>
                          🧾 Hoá đơn mới
                        </SelectItem>
                        <SelectItem value={NotificationType.CONTRACT_EXPIRING}>
                          📝 Hạn hợp đồng
                        </SelectItem>
                        <SelectItem value={NotificationType.PAYMENT_RECEIVED}>
                          ✅ Thanh toán thành công
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Liên kết điều hướng (tùy chọn)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="VD: /bills, /contracts, /rooms"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-[11px]">
                      Trang sẽ mở khi người dùng nhấn vào thông báo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">
                    Nội dung chi tiết <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Nhập nội dung thông báo đầy đủ cho khách thuê hoặc hệ thống..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createMutation.isPending}
              >
                Huỷ bỏ
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Phát thông báo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
