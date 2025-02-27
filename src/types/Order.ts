import { OrderItem } from "./OrderItem";

export interface Order {
    id: number;
    userEmail: string;
    totalPrice: number;
    createdAt: string;
    items: OrderItem[];
  }
  