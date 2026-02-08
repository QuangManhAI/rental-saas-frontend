import api from '@/lib/axios';
import { ApiResponse } from '@/types';

export interface ReportSummary {
  totalBills: number;
  totalRevenue: number;
  totalCollected: number;
  totalDebt: number;
}

export interface ReportResult {
  message: string;
  filename: string;
  url?: string;
  base64?: string;
  key: string;
  summary: ReportSummary;
  telegram?: { ok: boolean; messageId?: number };
}

export interface RevenueReportResult {
  message: string;
  filename: string;
  url?: string;
  base64?: string;
  key: string;
  summary: {
    totalBills: number;
    grandTotal: number;
    grandCollected: number;
    grandDebt: number;
  };
  telegram?: { ok: boolean; messageId?: number };
}

const BASE = '/reports';

export const reportsService = {
  /** Generate monthly Excel (no Telegram) */
  monthly: (month: number, year: number) =>
    api
      .get<ApiResponse<ReportResult>>(BASE + '/monthly', {
        params: { month, year },
      })
      .then((r) => r.data.data),

  /** Generate yearly revenue Excel (no Telegram) */
  revenue: (year: number) =>
    api
      .get<ApiResponse<RevenueReportResult>>(BASE + '/revenue', {
        params: { year },
      })
      .then((r) => r.data.data),

  /** Download monthly Excel file directly */
  downloadMonthlyExcel: (month: number, year: number) =>
    api
      .get(`/reports/monthly/excel`, {
        params: { month, year },
        responseType: 'blob',
      })
      .then((r) => r.data),

  /** Generate monthly Excel + send to owner's Telegram */
  monthlyTelegram: (month: number, year: number) =>
    api
      .get<ApiResponse<{ message: string; filename: string; telegram: { ok: boolean } }>>(
        `/reports/monthly/telegram`,
        { params: { month, year } },
      )
      .then((r) => r.data.data),

  /** Generate yearly revenue Excel + send to Telegram */
  revenueTelegram: (year: number) =>
    api
      .get<ApiResponse<RevenueReportResult>>(BASE + '/revenue/telegram', {
        params: { year },
      })
      .then((r) => r.data.data),
};
