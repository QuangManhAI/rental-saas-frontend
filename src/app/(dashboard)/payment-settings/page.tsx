'use client';

import { useState, useEffect } from 'react';
import { usePaymentSettings, useUpsertPaymentSettings } from '@/hooks/use-payment-settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Settings, Loader2, CheckCircle, AlertTriangle, RefreshCw, FlaskConical, Power, PowerOff } from 'lucide-react';

// Mask a string, showing first 4 and last 4 characters
function maskString(str: string): string {
    if (!str || str.length <= 8) return str ? '****' : '';
    return `${str.substring(0, 4)}****${str.substring(str.length - 4)}`;
}

export default function PaymentSettingsPage() {
    const { data: settings, isLoading, refetch } = usePaymentSettings();
    const { mutate: upsert, isPending } = useUpsertPaymentSettings();

    // Form states for inputs
    const [provider, setProvider] = useState<'MOMO' | 'VNPAY'>('MOMO');
    const [momoPartnerCode, setMomoPartnerCode] = useState('');
    const [momoAccessKey, setMomoAccessKey] = useState('');
    const [momoSecretKey, setMomoSecretKey] = useState('');

    // View state: 'LINKED' (show status) or 'FORM' (show inputs)
    const [mode, setMode] = useState<'LOADING' | 'LINKED' | 'FORM'>('LOADING');

    // Initialize state when settings load
    useEffect(() => {
        if (!isLoading) {
            if (settings) {
                console.log('PaymentSettings loaded:', settings);

                // Always sync form values with settings
                setProvider(settings.provider || 'MOMO');
                setMomoPartnerCode(settings.momoPartnerCode || '');
                setMomoAccessKey(settings.momoAccessKey || '');
                setMomoSecretKey(settings.momoSecretKey || '');

                // Determine mode based on credentials existence
                // This checks the "backend truth"
                const hasMomoCredentials = !!(settings.momoPartnerCode && settings.momoAccessKey && settings.momoSecretKey);

                // Only change mode if we are in LOADING state or if we are not explicitly in FORM mode (unless we lost credentials)
                setMode(prev => {
                    if (prev === 'LOADING') {
                        return hasMomoCredentials ? 'LINKED' : 'FORM';
                    }
                    // If we are linked but lost credentials (e.g. wiped from DB), go back to form
                    if (prev === 'LINKED' && !hasMomoCredentials) {
                        return 'FORM';
                    }
                    return prev;
                });
            } else {
                // No settings at all
                setMode('FORM');
            }
        }
    }, [settings, isLoading]);

    const handleSave = () => {
        upsert({
            provider,
            momoPartnerCode: provider === 'MOMO' ? momoPartnerCode : undefined,
            momoAccessKey: provider === 'MOMO' ? momoAccessKey : undefined,
            momoSecretKey: provider === 'MOMO' ? momoSecretKey : undefined,
            vnpayTmnCode: undefined,
            vnpayHashSecret: undefined,
            // Preserve current active state if it exists, default to false. 
            // NOTE: Requirement says "Do NOT reset state on reload". 
            // When saving new credentials, we might want to keep it inactive until user explicitly enables it, 
            // OR keep existing state. Safe bet is keep existing state.
            isActive: settings?.isActive ?? false,
        }, {
            onSuccess: () => {
                setMode('LINKED');
                refetch(); // Ensure we have the latest data
            }
        });
    };

    const handleToggleActive = (checked: boolean) => {
        // Only send isActive + provider — do NOT re-send masked credential strings
        upsert({
            provider: settings?.provider || 'MOMO',
            momoPartnerCode: settings?.momoPartnerCode,
            isActive: checked,
        });
    };

    const handleRelink = () => {
        setMode('FORM');
        // Form is already pre-filled by useEffect
    };

    const handleCancelRelink = () => {
        setMode('LINKED');
    };

    if (isLoading || mode === 'LOADING') {
        return (
            <div className="container mx-auto py-6">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Settings className="h-6 w-6" />
                    Cài đặt thanh toán
                </h1>
                <p className="text-muted-foreground mt-1">
                    Cấu hình các cổng thanh toán MoMo và VNPay
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Cổng thanh toán
                    </CardTitle>
                    <CardDescription>
                        Chọn và cấu hình cổng thanh toán bạn muốn sử dụng
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Provider Selection */}
                    <div className="flex items-center space-x-4">
                        <Button
                            variant={provider === 'MOMO' ? 'default' : 'outline'}
                            onClick={() => setProvider('MOMO')}
                            className="flex-1"
                        >
                            MoMo
                        </Button>
                        <Button
                            variant={provider === 'VNPAY' ? 'default' : 'outline'}
                            onClick={() => setProvider('VNPAY')}
                            className="flex-1"
                            disabled
                        >
                            VNPay (Sắp ra mắt)
                        </Button>
                    </div>

                    {/* MoMo Config Section */}
                    {provider === 'MOMO' && (
                        <div className="space-y-4 p-4 border rounded-lg">
                            <h3 className="font-semibold">Cấu hình MoMo</h3>

                            {mode === 'LINKED' ? (
                                <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                                    {/* LINKED STATUS VIEW */}
                                    <div className="p-4 bg-muted/50 border rounded-lg">
                                        <div className="flex items-center gap-2 font-medium mb-3 text-green-600">
                                            <CheckCircle className="h-5 w-5" />
                                            Đã liên kết với MoMo
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between py-1 border-b">
                                                <span className="text-muted-foreground">Partner Code:</span>
                                                <span className="font-mono font-medium">{settings?.momoPartnerCode}</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b">
                                                <span className="text-muted-foreground">Access Key:</span>
                                                <span className="font-mono">{maskString(settings?.momoAccessKey || '')}</span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b">
                                                <span className="text-muted-foreground">Môi trường:</span>
                                                <Badge variant="secondary">
                                                    <FlaskConical className="h-3 w-3 mr-1" />
                                                    Sandbox
                                                </Badge>
                                            </div>
                                            <div className="flex justify-between py-1">
                                                <span className="text-muted-foreground">Trạng thái:</span>
                                                {settings?.isActive ? (
                                                    <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                                        <Power className="h-3 w-3 mr-1" />
                                                        Đang hoạt động
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline">
                                                        <PowerOff className="h-3 w-3 mr-1" />
                                                        Tạm dừng
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons for Linked View */}
                                    <div className="space-y-4">
                                        {/* Activate Toggle */}
                                        <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                            <div>
                                                <p className="font-medium">Kích hoạt thanh toán</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Cho phép khách thuê thanh toán qua MoMo
                                                </p>
                                            </div>
                                            <Switch
                                                checked={settings?.isActive || false}
                                                onCheckedChange={handleToggleActive}
                                                disabled={isPending}
                                            />
                                        </div>

                                        {/* Re-link Button */}
                                        <Button
                                            variant="outline"
                                            onClick={handleRelink}
                                            className="w-full"
                                        >
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Liên kết lại MOMO
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid gap-4 animate-in fade-in zoom-in duration-300">
                                    {/* FORM VIEW */}
                                    <div className="space-y-2">
                                        <Label htmlFor="momoPartnerCode">Partner Code</Label>
                                        <Input
                                            id="momoPartnerCode"
                                            value={momoPartnerCode}
                                            onChange={(e) => setMomoPartnerCode(e.target.value)}
                                            placeholder="MOMO_PARTNER_CODE"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="momoAccessKey">Access Key</Label>
                                        <Input
                                            id="momoAccessKey"
                                            value={momoAccessKey}
                                            onChange={(e) => setMomoAccessKey(e.target.value)}
                                            placeholder="Access Key từ MoMo"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="momoSecretKey">Secret Key</Label>
                                        <Input
                                            id="momoSecretKey"
                                            type="password"
                                            value={momoSecretKey}
                                            onChange={(e) => setMomoSecretKey(e.target.value)}
                                            placeholder="Secret Key từ MoMo"
                                        />
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            onClick={handleSave}
                                            disabled={isPending || !momoPartnerCode || !momoAccessKey || !momoSecretKey}
                                            className="flex-1"
                                        >
                                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {mode === 'FORM' && settings?.momoPartnerCode ? 'Cập nhật kết nối' : 'Lưu kết nối'}
                                        </Button>

                                        {/* Show Cancel button if we have existing settings (Re-link mode) */}
                                        {settings?.momoPartnerCode && (
                                            <Button
                                                variant="outline"
                                                onClick={handleCancelRelink}
                                            >
                                                Hủy
                                            </Button>
                                        )}
                                    </div>

                                    <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 text-sm rounded-md">
                                        <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                        <div>
                                            Chỉ hỗ trợ môi trường Sandbox để thử nghiệm.
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
