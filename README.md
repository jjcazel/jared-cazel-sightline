# Order Data Interview App

A Next.js application for technical interviews. The data infrastructure is already built - your job is to build the visualization layer.

**👉 [Read the full requirements here: CANDIDATE_REQUIREMENTS.md](./CANDIDATE_REQUIREMENTS.md)**

---

## Getting Started

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

You'll see a demo page with sample data and your task description.

---

## What You're Working With

- **Next.js 14+** with App Router & TypeScript
- **TanStack Query** for data fetching
- **Tailwind CSS** + **Radix UI** for styling
- Fake order data (deterministic, ~200 items, 10 stores, 15 suppliers)

## Key Files

- `types/order.ts` - TypeScript definitions
- `hooks/use-orders.ts` - Main data fetching hook
- `app/page.tsx` - Demo page (replace with your solution)

**Again, see [CANDIDATE_REQUIREMENTS.md](./CANDIDATE_REQUIREMENTS.md) for full details.**
