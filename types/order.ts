export interface Order {
  orderNumber: string;
  storeName: string;
  orderDate: Date;
  subtotalAmount: number;
  totalAmount: number;
  lineItems: OrderLineItem[];
}

export interface OrderLineItem {
  orderNumber: string;
  itemNumber: string;
  supplierName: string;
  quantity: number;
  unitPrice: number;
}

