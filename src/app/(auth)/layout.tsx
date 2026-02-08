import { Building2 } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2">
          <Building2 className="h-10 w-10 text-primary" />
          <h1 className="text-2xl font-bold">Rental SaaS</h1>
          <p className="text-sm text-muted-foreground">
            Hệ thống quản lý nhà trọ chuyên nghiệp
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
