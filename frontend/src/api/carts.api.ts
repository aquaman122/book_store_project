import { httpClient } from "./http";
import { Cart } from "../models/cart.model";

interface AddCartParams {
  books_id: number;
  quantity: number;
}

export const addCart = async(params: AddCartParams) => {
  const response = await httpClient.post("/carts", params);
  return response.data;
};

export const fetchCart = async () => {
  const response = await httpClient.get<Cart[]>("/carts");
  return response.data;
};

export const deleteCart = async (cart_id: number) => {
  const response = await httpClient.delete(`/carts/${cart_id}`);
  return response.data;
}