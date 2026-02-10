import api from '@/lib/axios';

export enum GroupBy {
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year',
}

export interface AnalyticsFilter {
    houseId?: string;
    from: string; // ISO date string
    to: string;   // ISO date string
    groupBy: GroupBy;
}

export interface RevenueStat {
    period: string;
    totalRevenue: number;
    collected: number;
    outstanding: number;
}

export interface TrendStat {
    period: string;
    activeContracts: number;
    newContracts: number;
    occupiedRooms: number;
    vacantRooms: number;
}

export interface AnalyticsResponse {
    revenue: RevenueStat[];
    trends: TrendStat[];
}

export const analyticsService = {
    getDashboardAnalytics: async (filter: AnalyticsFilter) => {
        const { data } = await api.get<ApiResponse<AnalyticsResponse>>('/analytics/dashboard', {
            params: filter,
        });
        return data.data;
    },
};

interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}
