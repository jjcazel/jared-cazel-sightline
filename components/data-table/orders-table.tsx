"use client";

import { Order } from "@/types/order";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Cell,
} from "material-react-table";
import { useMemo } from "react";

/**
 * Calculates the total monetary amount for an order
 *
 * Sums the total prices of all line items in the order.
 *
 * @param order - The order object to calculate totals for
 * @returns Total price across all line items
 */
function calculateOrderTotal(order: Order): number {
  return order.lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
}

/**
 * Interactive data table displaying orders
 *
 * Renders a Material React Table with the following features:
 * - Sortable columns (click headers to sort)
 * - Filterable data (filter per column)
 * - Pagination (10 rows per page)
 * - Client-only rendering (no SSR, hydration-safe)
 *
 * Table columns:
 * - Order Number: Unique order identifier
 * - Store Name: Name of the store placing the order
 * - Order Date: Formatted date of the order
 * - Total Amount: Calculated sum of all line items' prices
 * - Line Items: Count of line items in the order
 *
 * @param props - Component props
 * @param props.orders - Array of Order objects to display
 * @returns Rendered Material React Table with full sorting/filtering capabilities
 */
export function OrdersTable({ orders }: { readonly orders: Order[] }) {
  const columns = useMemo<MRT_ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: "Order Number",
        size: 120,
      },
      {
        accessorKey: "storeName",
        header: "Store Name",
        size: 130,
      },
      {
        id: "orderDate",
        header: "Order Date",
        accessorFn: (row: Order) => {
          const date = row.orderDate;
          return date instanceof Date
            ? date.toLocaleDateString()
            : new Date(date as unknown as string).toLocaleDateString();
        },
        Cell: (props: { cell: MRT_Cell<Order, unknown> }) =>
          String(props.cell.getValue()),
        size: 120,
      },
      {
        id: "totalAmount",
        header: "Total Amount",
        accessorFn: (row: Order) => calculateOrderTotal(row),
        Cell: (props: { cell: MRT_Cell<Order, unknown> }) => {
          const amount = props.cell.getValue() as number;
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount);
        },
        size: 130,
      },
      {
        id: "lineItemCount",
        header: "Line Items",
        accessorFn: (row: Order) => row.lineItems.length,
        size: 100,
      },
    ],
    [],
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={orders}
      enableColumnFilterModes
      enablePagination={true}
      enableSorting={true}
      enableColumnActions={true}
      enableDensityToggle={false}
      initialState={{
        sorting: [{ id: "orderNumber", desc: false }],
        pagination: { pageIndex: 0, pageSize: 25 },
      }}
      muiTablePaperProps={{
        sx: {
          boxShadow: "none",
          border: "1px solid #e5e7eb",
          borderRadius: "0.5rem",
        },
      }}
      muiTableProps={{
        sx: {
          border: "none",
        },
      }}
      muiTopToolbarProps={{
        sx: {
          backgroundColor: "#f9fafb",
          borderBottom: "1px solid #e5e7eb",
        },
      }}
      muiBottomToolbarProps={{
        sx: {
          backgroundColor: "#f9fafb",
          borderTop: "1px solid #e5e7eb",
        },
      }}
      muiTableHeadCellProps={{
        sx: {
          backgroundColor: "#eef2ff",
          fontWeight: 600,
          fontSize: "0.875rem",
          color: "#1e1b4b",
          borderColor: "#e5e7eb",
        },
      }}
      muiTableBodyCellProps={{
        sx: {
          color: "#1f2937",
          fontSize: "0.875rem",
          borderColor: "#e5e7eb",
        },
      }}
    />
  );
}
