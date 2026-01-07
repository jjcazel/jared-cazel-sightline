# Interview Task: Order Data Dashboard

**Time Limit: 2 hours maximum**

## Overview

You'll build a data visualization dashboard using realistic order data. We've provided the complete data infrastructure (hooks → actions → data layer) - your focus is on the UI and data transformation layer.

**What we're evaluating:**

- React + TypeScript proficiency
- Data manipulation and transformation
- UI/UX judgment for making data actionable
- Code organization and reusability
- Prioritization under time constraints

## The Data

You're working with **Orders** and **OrderLineItems**:

```typescript
Order {
  orderNumber: string;
  storeName: string;
  orderDate: Date;
  subtotalAmount: number;
  totalAmount: number;
  lineItems: OrderLineItem[];
}

OrderLineItem {
  orderNumber: string;
  itemNumber: string;
  supplierName: string;
  quantity: number;
  unitPrice: number;
}
```

Full type definitions: [`types/order.ts`](types/order.ts)

The app generates deterministic fake data:

- 200 unique items
- 10 stores
- 15 suppliers
- Some logic for order frequencies and pricing

## Core Requirements (Pick Your Battles!)

**You should complete at least 2 of the following 3:**

### 1. Data Table

Display orders in a sortable table with key columns:

- Order Number
- Store Name
- Order Date
- Total Amount
- Number of Line Items

**Why we care:** Can you present tabular data clearly? Do you handle sorting and display well?

### 2. Filtering

Add at least **one** working filter:

- Store Name filter (dropdown or multi-select)
- OR Supplier Name filter (from line items)

**Why we care:** Can you work with nested data structures? How do you handle state?

### 3. Visualization

Create **one** meaningful chart showing:

- Daily order totals over the date range
- OR orders by store
- OR another metric you find interesting

**Why we care:** Can you transform data for visualization? How do you choose what to show?

## What We're Looking For

✅ **Working code** - We'll run `npm run dev` and test it  
✅ **Clean components** - Reusable, well-organized  
✅ **Proper TypeScript** - Types for props, state, data  
✅ **Thoughtful UI** - Intuitive, clean interface  
✅ **Smart trade-offs** - You can't do everything in 2 hours

❌ **Don't worry about:**

- Perfect styling (functional > beautiful)
- Edge cases (focus on happy path)
- Tests (we know you're time-constrained)
- Performance optimization (unless obvious)

## Getting Started

The infrastructure is ready:

```typescript
// Fetch orders for a date range
const { data: orders, isLoading } = useOrders(startDate, endDate);

// Helper functions available in actions
getStoreNames(); // All store names
getSupplierNames(); // All supplier names
getItemNumbers(); // All item numbers
```

**Your code goes in:**

- New components in `components/` (create subdirectories as needed)
- Replace the demo content in `app/page.tsx`

## Libraries

Feel free to install any libraries you're comfortable with:

- **Tables:** TanStack Table, AG Grid, or build your own
- **Charts:** Recharts, Chart.js, Victory, D3, Nivo
- **UI:** Any component library or stick with Tailwind CSS

## Deliverables

1. **Working code** that runs with `npm run dev`
2. **Brief comments** on complex logic (inline or in code)
3. **A short summary** (add to the bottom of this file):
   - What you built
   - Key decisions you made
   - What you'd add with more time

## Tips

- **Start simple** - Get one thing working well, then add more
- **Use the console** - The demo page logs all data, check the structure
- **Time-box decisions** - Don't spend 30 minutes picking a chart library
- **Partial > perfect** - A working table beats an unfinished table + broken chart
- **Document trade-offs** - If you skip something, explain why in your summary

## Questions?

If something is unclear:

- Check the browser console for data examples
- Review [`types/order.ts`](types/order.ts) for the data structure
- Look at the existing demo in [`app/page.tsx`](app/page.tsx)
- Email us - this is meant to be a straightforward exercise

---

## Your Summary

When you're done, add a brief summary here covering:

- **What you built** (which core features you chose)
- **Key decisions** you made along the way
- **What you'd add with more time**
