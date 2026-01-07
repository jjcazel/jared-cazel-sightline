# Order Data Interview App

A Next.js application with fake order data generation for technical interviews. This app provides the complete data infrastructure - candidates build the visualization layer.

## For Candidates

**👉 See [CANDIDATE_REQUIREMENTS.md](./CANDIDATE_REQUIREMENTS.md) for your interview task.**

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

### 3. Open the App

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

You'll see a demo page with:

- Date range picker (already working)
- Sample data display
- Basic statistics
- Your task description

## Tech Stack

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **React Query** (@tanstack/react-query) for data fetching
- **date-fns** for date manipulation
- **Tailwind CSS** for styling
- **Radix UI** for accessible components

## Architecture

The data infrastructure follows a clean pattern:

```
Page (Client) → useOrders Hook → getOrders Action → getOrdersFromDB → Generated Data
```

All the infrastructure is built - you focus on the UI layer.

## Data Overview

**Type definitions:** [`types/order.ts`](types/order.ts)

**Fake data includes:**

- 200 unique items (ITEM-001 to ITEM-200)
- 10 stores (Store A to Store J)
- 15 suppliers (Supplier 1 to Supplier 15)
- Realistic order frequencies and pricing
- Deterministic generation (same dates = same data)

## Project Structure

```
interview-app/
├── app/
│   ├── page.tsx            # Demo page - replace with your solution
│   └── layout.tsx          # Root layout with QueryProvider
├── components/ui/          # UI components (Button, DatePicker, etc.)
├── hooks/
│   └── use-orders.ts       # Main hook to fetch orders
├── actions/
│   └── orders.ts           # Server actions (getOrders, etc.)
├── data/
│   └── orders.ts           # Data generation logic
├── types/
│   └── order.ts            # TypeScript type definitions
└── CANDIDATE_REQUIREMENTS.md  # Your interview task
```

## Available Hooks & Functions

```typescript
// Fetch orders for a date range
const { data: orders, isLoading, error } = useOrders(startDate, endDate);

// Get filter options (from actions/orders.ts)
const stores = await getStoreNames();
const suppliers = await getSupplierNames();
const items = await getItemNumbers();
```

## For Interviewers

This app provides a complete data infrastructure for candidates to build against. The data layer generates realistic, deterministic fake data that mimics real-world order patterns.

**To use:**

1. Share the repository with the candidate
2. Give them [CANDIDATE_REQUIREMENTS.md](./CANDIDATE_REQUIREMENTS.md)
3. Allocate 2 hours for completion
4. Review their code + written summary
