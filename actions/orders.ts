'use server';

import { Order } from '@/types/order';
import {
  getOrdersFromDB,
  getAllStoreNames,
  getAllSupplierNames,
  getAllItemNumbers,
} from '@/data/orders';

export async function getOrders(
  startDate: Date,
  endDate: Date,
  filters?: {
    storeNames?: string[];
    supplierNames?: string[];
    itemNumbers?: string[];
  }
): Promise<Order[]> {
  return getOrdersFromDB(startDate, endDate, filters);
}

export async function getStoreNames(): Promise<string[]> {
  return getAllStoreNames();
}

export async function getSupplierNames(): Promise<string[]> {
  return getAllSupplierNames();
}

export async function getItemNumbers(): Promise<string[]> {
  return getAllItemNumbers();
}

