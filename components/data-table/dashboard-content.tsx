"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useOrders } from "@/hooks/use-orders";
import { DateRange } from "@/lib/date-presets";
import { createDateWithoutTime } from "@/lib/utils";
import { TableLoadingSkeleton } from "@/components/data-table/table-loading-skeleton";

const OrdersTable = dynamic(
  () =>
    import("@/components/data-table/orders-table").then((mod) => ({
      default: mod.OrdersTable,
    })),
  {
    ssr: false,
    loading: () => <TableLoadingSkeleton />,
  },
);

/**
 * Summary statistics cards component
 *
 * Displays three stat cards showing total orders, total line items, and total amount.
 * Formatted with thousands separators and currency formatting where applicable.
 *
 * @param props - Statistics data
 * @param props.totalOrders - Total number of orders
 * @param props.totalLineItems - Total number of line items across all orders
 * @param props.totalAmount - Total monetary value of all orders
 * @returns Three stat cards rendered in a responsive grid
 */
function SummaryCards({
  totalOrders,
  totalLineItems,
  totalAmount,
}: {
  readonly totalOrders: number;
  readonly totalLineItems: number;
  readonly totalAmount: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="text-sm font-medium text-gray-600 mb-1">
          Total Orders
        </div>
        <div className="text-3xl font-bold text-gray-900">
          {totalOrders.toLocaleString()}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="text-sm font-medium text-gray-600 mb-1">
          Total Line Items
        </div>
        <div className="text-3xl font-bold text-gray-900">
          {totalLineItems.toLocaleString()}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="text-sm font-medium text-gray-600 mb-1">
          Total Amount
        </div>
        <div className="text-3xl font-bold text-gray-900">
          $
          {totalAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * Animated skeleton loader for summary cards
 *
 * Shows placeholder cards with pulse animation while statistics are loading.
 * Maintains layout consistency to prevent layout shift (CLS).
 *
 * @returns Three skeleton cards in a responsive grid layout
 */
function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
}

/**
 * Container managing conditional rendering of data and loading states
 *
 * Handles the display logic for:
 * - Error states (displays error message)
 * - Loading states (shows skeleton loaders)
 * - Success states (displays statistics and table)
 *
 * Ensures static parts of the UI don't re-render when loading state changes.
 *
 * @param props - Data and state props
 * @param props.isLoading - Whether data is currently loading
 * @param props.error - Error object if data fetch failed, null otherwise
 * @param props.orders - Array of orders to display
 * @param props.totalLineItems - Calculated total line items count
 * @param props.totalAmount - Calculated total order amount
 * @returns Appropriate UI based on loading/error/success states
 */
function DataContainer({
  isLoading,
  error,
  orders,
  totalLineItems,
  totalAmount,
}: {
  readonly isLoading: boolean;
  readonly error: Error | null;
  readonly orders: any[] | undefined;
  readonly totalLineItems: number;
  readonly totalAmount: number;
}) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading orders: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <>
        <SummaryCardsSkeleton />
        <TableLoadingSkeleton />
      </>
    );
  }

  if (!orders) {
    return null;
  }

  return (
    <>
      <SummaryCards
        totalOrders={orders.length}
        totalLineItems={totalLineItems}
        totalAmount={totalAmount}
      />

      <Suspense fallback={<TableLoadingSkeleton />}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <OrdersTable orders={orders} />
        </div>
      </Suspense>
    </>
  );
}

/**
 * Main dashboard content component
 *
 * Client component managing:
 * - Date range selection and state
 * - Data fetching via React Query hook
 * - Console logging for debugging
 * - Rendering data with proper Suspense boundaries
 * - Loading states that don't affect static elements
 *
 * Only the data section (cards + table) show loading indicators.
 * The date picker remains interactive and responsive at all times.
 *
 * @returns Dashboard content with date picker, statistics, and data table
 */
export function DashboardContent() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: (() => {
      const date = new Date();
      date.setDate(date.getDate() - 6);
      return createDateWithoutTime(date);
    })(),
    to: createDateWithoutTime(new Date()),
    preset: "Last 7 Days",
  });

  const {
    data: orders,
    isLoading,
    error,
  } = useOrders(dateRange.from, dateRange.to);

  // Console log the data
  if (orders) {
    console.log(
      `📅 Date range: ${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`,
    );
    console.log(
      `📊 Total orders: ${orders.length} | Total line items: ${orders.reduce(
        (sum, o) => sum + o.lineItems.length,
        0,
      )}`,
    );
    console.log("📦 Orders data:", orders);
  }

  // Calculate stats
  const totalLineItems =
    orders?.reduce((sum, order) => sum + order.lineItems.length, 0) || 0;
  const totalAmount =
    orders?.reduce(
      (sum, order) =>
        sum +
        order.lineItems.reduce((itemSum, item) => itemSum + item.totalPrice, 0),
      0,
    ) || 0;

  return (
    <>
      {/* Date Range Filter - Always visible and interactive */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="block text-sm font-medium text-gray-700 mb-2">
          Date Range
        </div>
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          placeholder="Select date range"
        />
      </div>

      {/* Data Content - Shows loading state only for this section */}
      <DataContainer
        isLoading={isLoading}
        error={error}
        orders={orders}
        totalLineItems={totalLineItems}
        totalAmount={totalAmount}
      />
    </>
  );
}
