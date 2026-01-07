export const queryKeys = {
  orders: {
    byDateRange: (startDate: string, endDate: string) =>
      ['orders', startDate, endDate] as const,
  },
} as const;

