import React from "react";
import styled from "styled-components";
import Title from "../components/common/Title";
import { useOrders } from "../hooks/useOrders";
import { formatDate, formatNumber } from "../utils/format";
import Button from "../components/common/Button";

export default function OrderList() {
  const {orders, selectedItemId, selectOrderItem} = useOrders();

  return (
    <>
      <Title size="large">주문 내역</Title>
      <OrderListStyle>
        <table>
          <thead>
            <tr>
              <td>id</td>
              <td>주문일자</td>
              <td>주소</td>
              <td>수령인</td>
              <td>전화번호</td>
              <td>대표상품명</td>
              <td>수량</td>
              <td>금액</td>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
              <tr>
                <td>{order.id}</td>
                <td>{formatDate(order.created_at, "YYYY.MM.DD")}</td>
                <td>{order.address}</td>
                <td>{order.receiver}</td>
                <td>{order.contact}</td>
                <td>{order.books_title}</td>
                <td>{order.total_quantity} 권</td>
                <td>{formatNumber(order.total_price)} 원</td>
                <td>
                  <Button size="small" scheme="normal" onClick={() => selectOrderItem(order.id)}>자세히</Button>
                </td>
              </tr>
            {
              selectedItemId === order.id && order.detail && (
                <tr>
                  <td colSpan={8}>
                    <ul className="detail">
                      {order?.detail &&
                      order.detail.map((item, idx) => (
                        <li key={idx}>
                          <td>{item.title}</td>
                          <td>{item.author}</td>
                          <td>{item.quantity} 권</td>
                          <td>{formatNumber(item.price)} 원</td>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )
            }
            </React.Fragment>
            ))}
          </tbody>
        </table>
      </OrderListStyle>
    </>
  );
}

const OrderListStyle = styled.div`
  padding: 24px 0 0 0;
  border-raidus: ${({ theme }) => theme.borderRadius.default};

  table {
    wdith: 100%;
    border-collapse: collapse;
    border-top: 1px solid ${({ theme }) => theme.color.border};
    border-bottom: 1px solid ${({ theme }) => theme.color.border};


    th,
    td {
      padding: 16px;
      border-bottom: 1px solid ${({ theme }) => theme.color.border};
      text-align: center;

      button {
        diplay: flex;
        align-items: center;
        width: 60px;
        height: 35px;
      }
    }
  }

  .detail {
    margin: 0;
    li {
      list-style: square;
      text-align: left;
      div {
        display: flex;
        padding: 8px 12px;
        gap: 8px;
      }
    }
  }
`;