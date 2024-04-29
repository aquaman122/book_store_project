import React, { useMemo, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import styled from "styled-components";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import Empty from "../components/common/Empty";
import Title from "../components/common/Title";
import { useCart } from "../hooks/useCart";
import Button from "../components/common/Button";
import { useAlert } from "../hooks/useAlert";
import { OrderSheet } from "../models/order.model";
import { useNavigate } from "react-router-dom";

export default function Cart () {
  const { showAlert, showConfirm } = useAlert();
  const navigate = useNavigate();
  const { carts, isEmpty, deleteCartItem } = useCart();

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

  const totalQuantity = useMemo(() => {
    return carts.reduce((acc, cart) => {
      if (checkedItems.includes(cart.id)) {
        return acc + cart.quantity;
      }
      return acc;
    }, 0);
  }, [carts, checkedItems]);

  const totalPrice = useMemo(() => {
    return carts.reduce((acc, cart) => {
      if (checkedItems.includes(cart.id)) {
        return acc + cart.price * cart.quantity;
      }
      return acc;
    }, 0);
  }, [carts, checkedItems]);

  const handlerOrder = () => {
    if (checkedItems.length === 0) {
      showAlert("주문할 상품을 선택해주세요.");
      return;
    }

    // 주문 액션 -> 주문서 장성으로 데이터 전달
    const orderData: Omit<OrderSheet, "delivery"> = {
      items: checkedItems,
      totalQuantity,
      totalPrice,
      firstBookTitle: carts[0].title,
    };
    showConfirm("주문서를 작성하시겠습니까?", () => {
      navigate("/order", { state: orderData });
    });
  }

  return (
    <>
      <Title size="large">장바구니</Title>
      <CartStyle>
        {!isEmpty && (
          <>
            <div className="content">
              {carts.map((item) => (
                <CartItem key={item.id} cart={item} checkedItems={checkedItems} onCheck={handleCheckItem} onDelete={handleItemDelete} />
              ))}
            </div>
            <div className="summary">
              <CartSummary totalQuantity={totalQuantity} totalPrice={totalPrice} />
              <Button size="large" scheme="primary" onClick={handlerOrder}>주문 하기</Button>
            </div>
          </>
        )}
        {isEmpty && (
          <Empty title="장바구니가 있습니다" icon={<FaShoppingCart />} description={<>장바구니를 채워보세요.</>} />
        )}
      </CartStyle>
    </>
  );
}

export const CartStyle = styled.div`
  display: flex;
  gap: 24px;
  justify-content: space-between;
  padding: 24px 0 0 0;

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .summary {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .order-info {
    h1 {
      padding: 0 0 24px 0;
    }
    border: 1px solid ${({ theme }) => theme.color.border};
    border-radius: ${({ theme }) => theme.borderRadius.default};
    padding: 12px;
  }

  .delivery {
    fieldset {
      border: 0;
      margin: 0;
      padding: 0 0 12px 0;
      display: flex;
      justify-content: start;
      gap: 8px;

      label {
        width: 80px;
      }

      .input {
        flex: 1;
        width: 90%;

        input {
          height: 32px;
        }
      }

      button {
        display:flex;
        align-items: center;
        height: 32px;
      }

      .error-text { // Move this inside fieldset
        color: red;
        margin: 0;
        padding: 0 0 12px 0;
        text-align: right;
      }
    } // Close fieldset here
  }

  @media screen and ${({ theme }) => theme.mediaQuery.mobile} {
    flex-direction: column;
  }
`;