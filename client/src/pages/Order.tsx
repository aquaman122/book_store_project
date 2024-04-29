import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Title from "../components/common/Title";
import { CartStyle } from "./Cart";
import CartSummary from "../components/cart/CartSummary";
import Button from "../components/common/Button";
import InputText from "../components/common/InputText";
import { useForm } from "react-hook-form";
import { Delivery, OrderSheet } from "../models/order.model";
import FindAddressButton from "../components/order/FIndAddressButton";
import { order } from "../api/order.api";
import { useAlert } from "../hooks/useAlert";

interface DeliveryForm extends Delivery {
  addressDetail: string;
}

export default function Order() {
  const { showAlert, showConfirm } = useAlert();  
  const location = useLocation();
  const navigate = useNavigate();
  const orderDataFromCart = location.state;

  if (!orderDataFromCart) {
    console.log('orderDataFromCart is null');
    return <div>Error: No order data</div>;
  }
  
  const { totalQuantity, totalPrice, firstBookTitle } = orderDataFromCart;

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<DeliveryForm>();

  const handlePay = (data: DeliveryForm) => {
    const orderData: OrderSheet = {
      ...orderDataFromCart,
      delivery: {
        ...data,
        address: `${data.address} ${data.addressDetail}`
      }
    }
    // 서버로 넘겨준다.
    showConfirm("결제를 진행 하시겠습니까?", () => {
      order(orderData).then(() => {
        showAlert("주문이 완료되었습니다.");
        navigate("/orderlist");
      })
   });
  }

  return (
    <>
      <Title size="large">주문서 작성</Title>
      <CartStyle>
        <div className="content">
          <div className="order-info">
            <Title size="medium" color="text">
              배송 정보
            </Title>
            <form className="delivery">
              <fieldset>
                <label>주소</label>
                <div className="input">
                  <InputText type="text" placeholder="주소를 입력하세요" 
                    {...register("address", { required: true })} 
                  />
                </div>
                <FindAddressButton 
                  onCompleted={(address) => {
                    setValue("address", address);
                  }}
                />
              </fieldset>
              {errors.address && <p className="error-text">주소를 입력해주세요.</p>}

              <fieldset>
                <label>상세 주소</label>
                <div className="input">
                  <InputText type="text"
                    {...register("addressDetail", { required: true })}
                  />
                </div>
              </fieldset>
              {errors.address && <p className="error-text">상세주소를 입력해주세요.</p>}

              <fieldset>
                <label>수령인</label>
                <div className="input">
                  <InputText type="text"
                    {...register("receiver", { required: true })}
                  />
                </div>
              </fieldset>
              {errors.address && <p className="error-text">수령인을 입력해주세요.</p>}
              <fieldset>
                <label>전화번호</label>
                <div className="input">
                  <InputText type="text"
                    {...register("contact", { required: true })}
                  />
                </div>
              </fieldset>
              {errors.address && <p className="error-text">전화번호 입력해주세요.</p>}
            </form>
          </div>
          <div className="order-info">
            <Title size="medium">
              주문 상품
            </Title>
            <strong>
              {firstBookTitle} 등 총 {totalQuantity} 권
            </strong>
          </div>
        </div>
        <div className="summary">
          <CartSummary totalQuantity={totalQuantity} totalPrice={totalPrice} />
          <Button size="large" scheme="primary" onClick={handleSubmit(handlePay)}>결제하기</Button>
        </div>
      </CartStyle>
    </>
  );
}