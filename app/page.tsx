'use client';

import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useOrders } from '@/hooks/use-orders';
import { DateRange } from '@/lib/date-presets';
import { createDateWithoutTime } from '@/lib/utils';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

// Helper component for stat boxes
function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

// Helper component for displaying sample data fields
function DataField({
  label,
  value,
  color = 'blue',
  showQuotes = true,
}: {
  label: string;
  value: string | number;
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'gray';
  showQuotes?: boolean;
}) {
  const colorMap = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    orange: 'text-orange-600',
    gray: 'text-gray-600',
  };

  const displayValue =
    typeof value === 'string' && showQuotes ? `"${value}"` : value;

  return (
    <div>
      <span className="text-gray-500">{label}:</span>{' '}
      <span className={colorMap[color]}>{displayValue}</span>
    </div>
  );
}

export default function Home() {
  const [showSampleData, setShowSampleData] = useState(false);

  // Initialize with Last 7 Days
  const [dateRange, setDateRange] = useState<DateRange>({
    from: (() => {
      const date = new Date();
      date.setDate(date.getDate() - 6);
      return createDateWithoutTime(date);
    })(),
    to: createDateWithoutTime(new Date()),
    preset: 'Last 7 Days',
  });

  const {
    data: orders,
    isLoading,
    error,
  } = useOrders(dateRange.from, dateRange.to);

  // Console log the data whenever it changes
  useEffect(() => {
    if (orders) {
      console.log(
        `📅 Date range: ${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
      );
      console.log(
        `📊 Total orders: ${orders.length} | Total line items: ${orders.reduce(
          (sum, o) => sum + o.lineItems.length,
          0
        )}`
      );
      console.log('📦 Orders data:', orders);
    }
  }, [orders, dateRange]);

  // Log helper functions once on mount
  useEffect(() => {
    const logHelperFunctions = async () => {
      const { getStoreNames, getSupplierNames, getItemNumbers } = await import(
        '@/actions/orders'
      );

      const stores = await getStoreNames();
      if (stores.length > 0) {
        console.log('🏪 Available stores:', stores);
      }

      const suppliers = await getSupplierNames();
      if (suppliers.length > 0) {
        console.log('🚚 Available suppliers:', suppliers);
      }

      const items = await getItemNumbers();
      if (items.length > 0) {
        console.log(
          '📋 Available items:',
          items.slice(0, 10),
          `...and ${items.length - 10} more`
        );
      }
    };

    logHelperFunctions();
  }, []);

  const totalLineItems =
    orders?.reduce((sum, order) => sum + order.lineItems.length, 0) || 0;
  const totalAmount =
    orders?.reduce(
      (sum, order) =>
        sum + order.lineItems.reduce((itemSum, item) => itemSum + item.totalPrice, 0),
      0
    ) || 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Order Data Interview App
          </h1>

          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            placeholder="Select date range"
          />

          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">
                Error loading orders: {(error as Error).message}
              </p>
            </div>
          )}

          {orders && !isLoading && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatBox
                  label="Total Orders"
                  value={orders.length.toLocaleString()}
                />
                <StatBox
                  label="Total Line Items"
                  value={totalLineItems.toLocaleString()}
                />
                <StatBox
                  label="Total Amount"
                  value={`$${totalAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                />
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> Open your browser console to see the
                  full order data logged. The data includes {orders.length}{' '}
                  orders with {totalLineItems} line items from{' '}
                  {dateRange.from.toLocaleDateString()} to{' '}
                  {dateRange.to.toLocaleDateString()}.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setShowSampleData(!showSampleData)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">
                    View Sample Order Data
                  </span>
                  {showSampleData ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                {showSampleData && orders.length > 0 && (
                  <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <div className="space-y-4">
                      {/* Order Object */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Order Object:
                        </h4>
                        <div className="bg-white border border-gray-200 rounded p-3 text-xs font-mono space-y-1">
                          <DataField
                            label="orderNumber"
                            value={orders[0].orderNumber}
                          />
                          <DataField
                            label="storeName"
                            value={orders[0].storeName}
                          />
                          <DataField
                            label="orderDate"
                            value={orders[0].orderDate.toLocaleDateString()}
                            color="purple"
                            showQuotes={false}
                          />
                          <DataField
                            label="lineItems"
                            value={`[${orders[0].lineItems.length} items]`}
                            color="gray"
                            showQuotes={false}
                          />
                        </div>
                      </div>

                      {/* Line Items */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Sample <code>lineItems</code> from this order:
                        </h4>
                        <div className="space-y-2">
                          {orders[0].lineItems.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-white border border-gray-200 rounded p-3 text-xs font-mono space-y-1"
                            >
                              <DataField
                                label="orderNumber"
                                value={item.orderNumber}
                              />
                              <DataField
                                label="itemNumber"
                                value={item.itemNumber}
                              />
                              <DataField
                                label="supplierName"
                                value={item.supplierName}
                              />
                              <DataField
                                label="quantity"
                                value={item.quantity}
                                color="orange"
                              />
                              <DataField
                                label="unitPrice"
                                value={item.unitPrice.toFixed(2)}
                                color="green"
                              />
                              <DataField
                                label="totalPrice"
                                value={item.totalPrice.toFixed(2)}
                                color="green"
                              />
                            </div>
                          ))}
                          {orders[0].lineItems.length > 3 && (
                            <p className="text-xs text-gray-500 italic">
                              ...and {orders[0].lineItems.length - 3} more line
                              items
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">
                  Your Task:
                </h3>
                <p className="text-sm text-green-800">
                  Build a data visualization dashboard using this order data.
                  See{' '}
                  <a
                    href="https://github.com/derrick-sightline/interview-app/blob/main/CANDIDATE_REQUIREMENTS.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold underline hover:text-green-900"
                  >
                    CANDIDATE_REQUIREMENTS.md
                  </a>{' '}
                  for full requirements (2 hour time limit).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
