export const DATE_PRESETS = {
  TODAY: 'Today',
  LAST_3_DAYS: 'Last 3 Days',
  LAST_7_DAYS: 'Last 7 Days',
  LAST_14_DAYS: 'Last 14 Days',
  LAST_30_DAYS: 'Last 30 Days',
};

export interface DateRange {
  from: Date;
  to: Date;
  preset: string | null;
}

export interface PresetRange {
  startDate: Date;
  endDate: Date;
}

export const presetRangeFunctions: Record<string, () => PresetRange> = {
  [DATE_PRESETS.TODAY]: () => ({
    startDate: new Date(),
    endDate: new Date(),
  }),

  [DATE_PRESETS.LAST_3_DAYS]: () => {
    const start = new Date();
    start.setDate(start.getDate() - 2);
    return { startDate: start, endDate: new Date() };
  },

  [DATE_PRESETS.LAST_7_DAYS]: () => {
    const start = new Date();
    start.setDate(start.getDate() - 6);
    return { startDate: start, endDate: new Date() };
  },

  [DATE_PRESETS.LAST_14_DAYS]: () => {
    const start = new Date();
    start.setDate(start.getDate() - 13);
    return { startDate: start, endDate: new Date() };
  },

  [DATE_PRESETS.LAST_30_DAYS]: () => {
    const start = new Date();
    start.setDate(start.getDate() - 29);
    return { startDate: start, endDate: new Date() };
  },
};

