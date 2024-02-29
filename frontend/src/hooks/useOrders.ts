import { useEffect, useState } from "react";
import { Order } from "../models/order.model";
import { fetchOrder, fetchOrders } from "../api/order.api";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedItemId, setselectedItemId] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders().then((orders) => {
      setOrders(orders);
    })
  }, []);

  const selectOrderItem = (order_id: number) => {
    fetchOrder(order_id).then((orderDetail) => {
      console.log("orderDetail", orderDetail);
    })
  }

  return { orders, selectedItemId, selectOrderItem };
}
