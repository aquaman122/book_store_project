export interface Order {
  id: number;
  createdAt: string;
  address: string;
  receiver: string;
  contact: string;
  bookTitle: string;
  totalQuantity: number;
  totalPrice: number;
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