import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { formatDateWithoutTime } from '@/lib/utils';

export function useOrders(startDate: Date, endDate: Date) {
  return useQuery({
    queryKey: queryKeys.orders.byDateRange(
      formatDateWithoutTime(startDate),
      formatDateWithoutTime(endDate)
    ),
    queryFn: async () => {
      const { getOrders } = await import('@/actions/orders');
      return getOrders(startDate, endDate);
    },
  });
}

