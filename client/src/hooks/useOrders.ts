import { useEffect, useState } from "react";
import { Order, OrderListItem } from "../models/order.model";
import { fetchOrder, fetchOrders, order } from "../api/order.api";

export const useOrders = () => {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [selectedItemId, setselectedItemId] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders().then((orders) => {
      setOrders(orders);
    })
  }, []);

  const selectOrderItem = (order_id: number) => {
    // 요청 방어
    if (orders.filter((item) => item.id === order_id)[0].detail) {
      setselectedItemId(order_id);
      return;
    }

    fetchOrder(order_id).then((orderDetail) => {
      setselectedItemId(order_id);
      setOrders(
        orders.map((item) => {
          if (item.id === order_id) {
            return {
              ...item,
              detail: orderDetail,
            };
          }
          return item;
        })
      )
    })
  }

  return { orders, selectedItemId, selectOrderItem };
}
