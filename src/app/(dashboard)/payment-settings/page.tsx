'use client';

import { useState, useEffect } from 'react';
import { usePaymentSettings, useUpsertPaymentSettings } from '@/hooks/use-payment-settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, Settings, Loader2, Check } from 'lucide-react';

export default function PaymentSettingsPage() {
    const { data: settings, isLoading } = usePaymentSettings();
    const { mutate: upsert, isPending } = useUpsertPaymentSettings();

    const [provider, setProvider] = useState<'MOMO' | 'VNPAY'>('MOMO');
    const [momoPartnerCode, setMomoPartnerCode] = useState('');
    const [momoAccessKey, setMomoAccessKey] = useState('');
    const [momoSecretKey, setMomoSecretKey] = useState('');
    const [vnpayTmnCode, setVnpayTmnCode] = useState('');
    const [vnpayHashSecret, setVnpayHashSecret] = useState('');
    const [isActive, setIsActive] = useState(false);

    // Update form when settings load
    useEffect(() => {
        if (settings) {
            setProvider(settings.provider);
            setMomoPartnerCode(settings.momoPartnerCode || '');
            setMomoAccessKey(settings.momoAccessKey || '');
            setMomoSecretKey(settings.momoSecretKey || '');
            setVnpayTmnCode(settings.vnpayTmnCode || '');
            setVnpayHashSecret(settings.vnpayHashSecret || '');
            setIsActive(settings.isActive);
        }
    }, [settings]);

    const handleSave = () => {
        upsert({
            provider,
            momoPartnerCode: provider === 'MOMO' ? momoPartnerCode : undefined,
            momoAccessKey: provider === 'MOMO' ? momoAccessKey : undefined,
            momoSecretKey: provider === 'MOMO' ? momoSecretKey : undefined,
            vnpayTmnCode: provider === 'VNPAY' ? vnpayTmnCode : undefined,
            vnpayHashSecret: provider === 'VNPAY' ? vnpayHashSecret : undefined,
            isActive,
        });
    };

    if (isLoading) {
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
                        >
                            VNPay
                        </Button>
                    </div>

                    {/* MoMo Settings */}
                    {provider === 'MOMO' && (
                        <div className="space-y-4 p-4 border rounded-lg bg-pink-50/50 dark:bg-pink-950/20">
                            <h3 className="font-semibold text-pink-600">Cấu hình MoMo</h3>
                            <div className="grid gap-4">
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
                            </div>
                        </div>
                    )}

                    {/* VNPay Settings */}
                    {provider === 'VNPAY' && (
                        <div className="space-y-4 p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
                            <h3 className="font-semibold text-blue-600">Cấu hình VNPay</h3>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="vnpayTmnCode">TMN Code</Label>
                                    <Input
                                        id="vnpayTmnCode"
                                        value={vnpayTmnCode}
                                        onChange={(e) => setVnpayTmnCode(e.target.value)}
                                        placeholder="VNPay Terminal Code"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="vnpayHashSecret">Hash Secret</Label>
                                    <Input
                                        id="vnpayHashSecret"
                                        type="password"
                                        value={vnpayHashSecret}
                                        onChange={(e) => setVnpayHashSecret(e.target.value)}
                                        placeholder="VNPay Hash Secret"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="text-base font-medium">Kích hoạt thanh toán</p>
                            <p className="text-sm text-muted-foreground">
                                Bật để cho phép khách thuê thanh toán qua cổng này
                            </p>
                        </div>
                        <Button
                            variant={isActive ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setIsActive(!isActive)}
                        >
                            {isActive ? (
                                <>
                                    <Check className="mr-1 h-4 w-4" />
                                    Đang bật
                                </>
                            ) : (
                                'Đã tắt'
                            )}
                        </Button>
                    </div>

                    {/* Save Button */}
                    <Button
                        onClick={handleSave}
                        disabled={isPending}
                        className="w-full"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang lưu...
                            </>
                        ) : (
                            'Lưu cài đặt'
                        )}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
