import React, { useState } from "react";
import styled from "styled-components";
import CartItem from "../components/cart/CartItem";
import Title from "../components/common/Title";
import { useCart } from "../hooks/useCart";

export default function Cart () {
  const { carts, deleteCartItem } = useCart();

  const [ checkedItems, setCheckedItems ] = useState<number[]>([]);

  const handleCheckItem = (id: number) => {
    // unCheck
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter((item) => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  }

  const handleItemDelete = (id:number) => {
    // 삭제 행위
    // confirm ? 
    deleteCartItem(id);
  }

  return (
    <>
      <Title size="large">장바구니</Title>
      <CartStyle>
        <div className="content">
          {carts.map((item) => (
            <CartItem key={item.id} cart={item} checkedItems={checkedItems} onCheck={handleCheckItem} onDelete={handleItemDelete} />
          ))}
        </div>
        <div className="summary">
          summary
        </div>
      </CartStyle>
    </>
  );
}

const CartStyle = styled.div``;