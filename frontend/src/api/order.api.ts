import { Order, OrderDetailItem, OrderSheet } from "../models/order.model";
import { httpClient, requestHandler } from "./http";

export const order = async (orderData: OrderSheet) => {
  requestHandler("post", "/orders", orderData);
}

export const fetchOrders = async () => {
  const response = await httpClient.get<Order[]>("/orders");
  return response.data;
}

export const fetchOrder = async (order_id: number) => {
  const response = await httpClient.get<OrderDetailItem[]>(`/orders/${order_id}`);
  return response.data;
}