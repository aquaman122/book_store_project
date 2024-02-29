import { Order, OrderSheet } from "../models/order.model";
import { httpClient } from "./http";

export const order = async (orderData: OrderSheet) => {
  const response = await httpClient.post("/orders", orderData);
  return response.data;
}

export const fetchOrders = async () => {
  const response = await httpClient.get<Order[]>("/orders");
  return response.data;
}

export const fetchOrder = async (order_id: number) => {
  const response = await httpClient.get<Order>(`/orders/${order_id}`);
  return response.data;
}