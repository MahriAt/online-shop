export interface OrderProduct {
  id: number;
  name: string;
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  product: OrderProduct;
}

export interface Order {
  id: number;
  userId: number;
  status: string;
  items: OrderItem[];
}
