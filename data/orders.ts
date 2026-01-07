import { Order, OrderLineItem } from '@/types/order';

// Simple seeded random number generator (Mulberry32)
function seededRandom(seed: number): () => number {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Hash a string to a number for seeding
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Constants for data generation
const STORE_NAMES = Array.from({ length: 10 }, (_, i) => 
  `Store ${String.fromCharCode(65 + i)}`
); // Store A through Store J

const SUPPLIER_NAMES = Array.from({ length: 15 }, (_, i) => 
  `Supplier ${i + 1}`
); // Supplier 1 through Supplier 15

const ITEM_COUNT = 200;
const ITEM_NUMBERS = Array.from({ length: ITEM_COUNT }, (_, i) => 
  `ITEM-${String(i + 1).padStart(3, '0')}`
); // ITEM-001 through ITEM-200

// Determine item frequency tier based on item number
function getItemFrequency(itemNumber: string): {
  tier: 'high' | 'medium' | 'low';
  ordersPerWeek: number;
} {
  const itemIndex = ITEM_NUMBERS.indexOf(itemNumber);
  const percentage = itemIndex / ITEM_COUNT;
  
  if (percentage < 0.2) {
    return { tier: 'high', ordersPerWeek: 2.5 }; // 2-3 times per week
  } else if (percentage < 0.7) {
    return { tier: 'medium', ordersPerWeek: 1.5 }; // 1-2 times per week
  } else {
    return { tier: 'low', ordersPerWeek: 0.25 }; // ~1 time per month
  }
}

// Get stable base price for an item with small random variance
function getItemPrice(itemNumber: string, rng: () => number): number {
  // Generate consistent base price per item
  const itemSeed = hashString(itemNumber);
  const baseRng = seededRandom(itemSeed);
  const basePrice = baseRng() * 145 + 5; // $5-$150 base
  
  // Add small variance (±5%) using the order-specific rng
  const variance = (rng() - 0.5) * 0.1; // -5% to +5%
  const finalPrice = basePrice * (1 + variance);
  
  return Math.round(finalPrice * 100) / 100;
}

/**
 * Generate fake orders for a given date range with deterministic randomness
 */
export async function getOrdersFromDB(
  startDate: Date,
  endDate: Date,
  filters?: {
    storeNames?: string[];
    supplierNames?: string[];
    itemNumbers?: string[];
  }
): Promise<Order[]> {
  const orders: Order[] = [];
  const orderMap = new Map<string, Order>();
  
  // Generate data for each day in the range
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);
  
  const endDateTime = new Date(endDate);
  endDateTime.setHours(23, 59, 59, 999);
  
  while (currentDate <= endDateTime) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // For each item, decide if it should have an order on this day
    ITEM_NUMBERS.forEach((itemNumber) => {
      const frequency = getItemFrequency(itemNumber);
      const seed = hashString(`${dateStr}-${itemNumber}`);
      const rng = seededRandom(seed);
      
      // Calculate daily probability based on orders per week
      const dailyProbability = frequency.ordersPerWeek / 7;
      
      if (rng() < dailyProbability) {
        // Apply filters
        if (filters?.itemNumbers && !filters.itemNumbers.includes(itemNumber)) {
          return;
        }
        
        // Pick a random store and supplier
        const storeIndex = Math.floor(rng() * STORE_NAMES.length);
        const storeName = STORE_NAMES[storeIndex];
        
        if (filters?.storeNames && !filters.storeNames.includes(storeName)) {
          return;
        }
        
        const supplierIndex = Math.floor(rng() * SUPPLIER_NAMES.length);
        const supplierName = SUPPLIER_NAMES[supplierIndex];
        
        if (filters?.supplierNames && !filters.supplierNames.includes(supplierName)) {
          return;
        }
        
        // Generate line item details
        const quantity = Math.floor(rng() * 20) + 1; // 1-20 units
        const unitPrice = getItemPrice(itemNumber, rng); // Stable price per item with small variance
        
        const lineItem: OrderLineItem = {
          orderNumber: '', // Will be set when we assign to an order
          itemNumber,
          supplierName,
          quantity,
          unitPrice,
        };
        
        // Group line items into orders (try to batch 3-5 items per order for same store/date)
        const orderKey = `${dateStr}-${storeName}-${Math.floor(rng() * 3)}`; // Create ~3 possible orders per store per day
        
        let order = orderMap.get(orderKey);
        if (!order) {
          const orderNumber = `ORD-${dateStr}-${String(orderMap.size + 1).padStart(4, '0')}`;
          order = {
            orderNumber,
            storeName,
            orderDate: new Date(currentDate),
            subtotalAmount: 0,
            totalAmount: 0,
            lineItems: [],
          };
          orderMap.set(orderKey, order);
        }
        
        lineItem.orderNumber = order.orderNumber;
        order.lineItems.push(lineItem);
      }
    });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Calculate totals for each order
  orderMap.forEach((order) => {
    const subtotal = order.lineItems.reduce(
      (sum, item) => sum + (item.quantity * item.unitPrice),
      0
    );
    order.subtotalAmount = Math.round(subtotal * 100) / 100;
    order.totalAmount = Math.round(subtotal * 1.08 * 100) / 100; // Add 8% tax
  });
  
  // Convert map to array and sort by date descending
  const sortedOrders = Array.from(orderMap.values()).sort(
    (a, b) => b.orderDate.getTime() - a.orderDate.getTime()
  );
  
  return sortedOrders;
}

// Export helper functions for use in the UI
export function getAllStoreNames(): string[] {
  return [...STORE_NAMES];
}

export function getAllSupplierNames(): string[] {
  return [...SUPPLIER_NAMES];
}

export function getAllItemNumbers(): string[] {
  return [...ITEM_NUMBERS];
}

