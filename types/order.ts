export interface Order {
  orderNumber: string;
  storeName: string;
  orderDate: Date;
  lineItems: OrderLineItem[];
}

export interface OrderLineItem {
  orderNumber: string;
  itemNumber: string;
  supplierName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number; // totalPrice = unitPrice * quantity
}

