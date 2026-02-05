export interface Customer {
  id: string;
  name: string;
  email: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  availableQty: number;
  price: number;
}

export interface CartItem {
  item: Item;
  qty: number;
}

export interface OrderRequest {
  customerId: string;
  items: {
    itemId: string;
    qty: number;
  }[];
}