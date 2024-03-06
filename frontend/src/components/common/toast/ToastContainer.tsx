import React from "react";
import useToastStore from "@/store/toastStore";
import styled from "styled-components";
import Toast from "./Toast";

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  return (
    <ToastContainerStyle>
      {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} message={toast.message} type={toast.type} />
        ))}
    </ToastContainerStyle>
  );
}

const ToastContainerStyle = styled.div`
  position: fixed;
  top: 32px;
  right: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
