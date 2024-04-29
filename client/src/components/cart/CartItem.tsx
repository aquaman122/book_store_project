import React, { useMemo } from "react";
import styled from "styled-components";
import { Cart } from "../../models/cart.model";
import { formatNumber } from "../../utils/format";
import Button from "../common/Button";
import Title from "../common/Title";
import CheckIconButton from "./CheckIconButton";

interface Props {
  cart: Cart;
  checkedItems: number[];
  onCheck: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function CartItem({ cart, checkedItems, onCheck, onDelete }: Props) {
  // const { showConfirm } = useAlert();
  // checkedItems 목록에 내가 있는지 판다 = checked
  const isChecked = useMemo(() => {
    return checkedItems.includes(cart.id);
  }, [checkedItems, cart.id]);

  const handleCheck = () => {
    onCheck(cart.id);
  }

  const handleDelete = () => {
    // showConfirm("정말 삭제하시겠습니까?", () => {
    //   onDelete(cart.id);
    // });
    onDelete(cart.id);
  }

  return (
    <CartItemStyle>
      <div className="info">
        <div className="check">
          <CheckIconButton isChecked={isChecked} onCheck={handleCheck} />
        </div>
        <div>
          <Title size="medium">{cart.title}</Title>
          <p className="summary">{cart.summary}</p>
          <p className="price">{formatNumber(cart.price)}</p>
          <p className="quantity">{cart.quantity} 권</p>
        </div>
      </div>
      <Button size="medium" scheme="normal" onClick={handleDelete}>장바구니 삭제</Button>
    </CartItemStyle>
  );
}

const CartItemStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: ${({ theme }) => theme.borderRadius.default};
  padding: 6px;

  p {
    padding: 0 0 4px 0;
    margin: 0;
  }

  .info {
    display: flex;
    gap: 24px;
    align-items: start;
    width: 100%;
  

    .check {
      width: 28px;
      flex-shrink: 0;
    }
    .summary {
      color: ${({ theme }) => theme.color.secondaryText};
    }

    .price {
      font-size: 1.2rem;
      font-weight: 700;
    }

    .quantity {
      font-size: 1.2rem;
      font-weight: 700;
    }
  }
`;