import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { analyticsService, AnalyticsFilter } from '@/services/analytics.service';

export const useDashboardAnalytics = (filter: AnalyticsFilter) => {
    return useQuery({
        queryKey: ['dashboard-analytics', filter],
        queryFn: () => analyticsService.getDashboardAnalytics(filter),
        staleTime: 5 * 60 * 1000, // 5 minutes
        placeholderData: keepPreviousData,
    });
};
