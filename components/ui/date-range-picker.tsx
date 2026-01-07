'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import * as React from 'react';
import { DateRangePicker as RangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { DATE_PRESETS, presetRangeFunctions, DateRange } from '@/lib/date-presets';
import { formatDateRangeWithPreset } from '@/lib/utils';
import { cn } from '@/lib/utils';

const customStyles = `
  .custom-calendar-no-sidebar .rdrDefinedRangesWrapper {
    display: none !important;
    width: 0 !important;
  }

  .custom-calendar-no-sidebar .rdrDateRangePickerWrapper {
    display: flex;
    width: 100%;
  }

  .custom-calendar-no-sidebar .rdrDateDisplayWrapper {
    display: none;
  }

  .custom-date-range-calendar .rdrMonthAndYearWrapper {
    padding-top: 0;
  }
`;

const defaultStaticRanges = [
  DATE_PRESETS.TODAY,
  DATE_PRESETS.LAST_3_DAYS,
  DATE_PRESETS.LAST_7_DAYS,
  DATE_PRESETS.LAST_14_DAYS,
  DATE_PRESETS.LAST_30_DAYS,
].map((label) => ({
  label,
  range: presetRangeFunctions[label],
}));

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  className?: string;
  placeholder?: string;
  presets?: {
    label: string;
    range: () => { startDate: Date; endDate: Date };
  }[];
}

interface RangeType {
  startDate?: Date;
  endDate?: Date;
  key: string;
}

export function DateRangePicker({
  value,
  onChange,
  className,
  placeholder = 'Select date range',
  presets = defaultStaticRanges,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [startDateInput, setStartDateInput] = React.useState('');
  const [endDateInput, setEndDateInput] = React.useState('');
  const [selectedPreset, setSelectedPreset] = React.useState<string | null>(
    value.preset || null
  );

  const [selectedRange, setSelectedRange] = React.useState<RangeType>({
    startDate: value.from,
    endDate: value.to,
    key: 'selection',
  });

  const isValidDate = (date: Date | undefined): boolean => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  const doesRangeIncludeToday = React.useCallback(() => {
    if (!isValidDate(value.from) || !isValidDate(value.to)) {
      return false;
    }

    const today = new Date();
    const todayMidnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const fromMidnight = new Date(
      value.from.getFullYear(),
      value.from.getMonth(),
      value.from.getDate()
    );
    const toMidnight = new Date(
      value.to.getFullYear(),
      value.to.getMonth(),
      value.to.getDate()
    );

    return todayMidnight >= fromMidnight && todayMidnight <= toMidnight;
  }, [value.from, value.to]);

  const hasDateRangeChanged = React.useCallback(() => {
    if (
      !isValidDate(selectedRange.startDate) ||
      !isValidDate(selectedRange.endDate)
    ) {
      return false;
    }

    if (!isValidDate(value.from) || !isValidDate(value.to)) {
      return true;
    }

    const selectedStartStr = selectedRange.startDate!.toDateString();
    const selectedEndStr = selectedRange.endDate!.toDateString();
    const currentStartStr = value.from.toDateString();
    const currentEndStr = value.to.toDateString();

    return (
      selectedStartStr !== currentStartStr || selectedEndStr !== currentEndStr
    );
  }, [selectedRange.startDate, selectedRange.endDate, value.from, value.to]);

  React.useEffect(() => {
    setSelectedRange({
      startDate: value.from,
      endDate: value.to,
      key: 'selection',
    });
    setSelectedPreset(value.preset || null);
  }, [value.from, value.to, value.preset]);

  React.useEffect(() => {
    if (selectedRange.startDate) {
      setStartDateInput(format(selectedRange.startDate, 'MM/dd/yyyy'));
    }
    if (selectedRange.endDate) {
      setEndDateInput(format(selectedRange.endDate, 'MM/dd/yyyy'));
    }
  }, [selectedRange.startDate, selectedRange.endDate]);

  const handleRangeChange = (rangesByKey: any) => {
    if (rangesByKey.selection) {
      setSelectedRange(rangesByKey.selection);
    }
  };

  const handleChange = (newRange: {
    from?: Date;
    to?: Date;
    preset?: string | null;
  }) => {
    onChange({
      from: newRange.from || value.from,
      to: newRange.to || value.to,
      preset: newRange.preset ?? null,
    });
  };

  const handlePresetClick = (preset: (typeof presets)[0]) => {
    const range = preset.range();
    handleChange({
      from: range.startDate,
      to: range.endDate,
      preset: preset.label,
    });
    setOpen(false);
  };

  const handleApply = () => {
    handleChange({
      from: selectedRange.startDate,
      to: selectedRange.endDate,
      preset: null,
    });
    setSelectedPreset(null);
    setOpen(false);
  };

  const handleCancel = () => {
    setSelectedRange({
      startDate: value.from,
      endDate: value.to,
      key: 'selection',
    });
    setOpen(false);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <style jsx global>
        {customStyles}
      </style>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'w-[400px] justify-start text-left font-normal',
              !value.from && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {isValidDate(value.from) && isValidDate(value.to) ? (
              <div className="flex items-center gap-2">
                <span>
                  {formatDateRangeWithPreset(
                    value.from,
                    value.to,
                    value.preset
                  )}
                </span>
                {!doesRangeIncludeToday() && (
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-[1px] h-auto text-gray-500 border-gray-300"
                  >
                    past
                  </Badge>
                )}
              </div>
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
          style={{ height: '430px' }}
        >
          <div className="px-3 pt-3 flex flex-col h-full">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <Input
                  value={startDateInput}
                  onChange={(e) => setStartDateInput(e.target.value)}
                  placeholder="Start date"
                  className="w-[120px]"
                  onBlur={() => {
                    try {
                      const date = new Date(startDateInput);
                      if (!isNaN(date.getTime())) {
                        setSelectedRange({
                          ...selectedRange,
                          startDate: date,
                        });
                      }
                    } catch (e) {
                      // Invalid date format
                    }
                  }}
                />
                <span>to</span>
                <Input
                  value={endDateInput}
                  onChange={(e) => setEndDateInput(e.target.value)}
                  placeholder="End date"
                  className="w-[120px]"
                  onBlur={() => {
                    try {
                      const date = new Date(endDateInput);
                      if (!isNaN(date.getTime())) {
                        setSelectedRange({
                          ...selectedRange,
                          endDate: date,
                        });
                      }
                    } catch (e) {
                      // Invalid date format
                    }
                  }}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleApply}
                  disabled={
                    !selectedRange.startDate ||
                    !selectedRange.endDate ||
                    !hasDateRangeChanged()
                  }
                >
                  Apply
                </Button>
              </div>
            </div>

            <div className="flex-1 flex">
              <div style={{ flex: 1 }}>
                <RangePicker
                  ranges={[selectedRange]}
                  onChange={handleRangeChange}
                  months={2}
                  direction="horizontal"
                  showDateDisplay={false}
                  moveRangeOnFirstSelection={false}
                  editableDateInputs={false}
                  maxDate={new Date()}
                  rangeColors={['#3b82f6']}
                  fixedHeight={true}
                  staticRanges={[]}
                  inputRanges={[]}
                  className="custom-calendar-no-sidebar"
                  preventSnapRefocus={true}
                />
              </div>

              <div className="border-l my-2 ml-2 flex flex-col pl-2 pt-4 min-w-[160px]">
                <div className="flex flex-col">
                  {presets.map((preset, index) => (
                    <Button
                      variant={'ghost'}
                      key={index}
                      className="text-sm text-left py-1 hover:bg-slate-100 px-2 rounded-sm"
                      onClick={() => handlePresetClick(preset)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

