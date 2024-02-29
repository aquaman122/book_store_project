export interface Order {
  id: number;
  created_at: string;
  address: string;
  receiver: string;
  contact: string;
  books_title: string;
  total_quantity: number;
  total_price: number;
}

export interface OrderSheet {
  items: number[];
  totalPrice: number;
  totalQuantity: number;
  firstBookTitle: string;
  delivery: {
    address: string;
    receiver: string;
    contact: string;
  }
}

export interface Delivery {
  address: string;
  receiver: string;
  contact: string;
}