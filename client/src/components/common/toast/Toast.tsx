import React, { useState } from "react";
import styled from "styled-components";
import useToastStore, {Toast as IToast} from "@/store/toastStore";
import { FaPlus, FaBan, FaInfoCircle } from "react-icons/fa";
import useTimeout from "@/hooks/useTimeout";

export const TOAST_REMOVE_DELAY = 3000;

export default function Toast({ id, message, type}: IToast) {
  const removeToast = useToastStore((state) => state.removeToast);
  const [isFadeOut, setIsFadeOut] = useState(false);
  const handlerRemoveToast = () => {
    setIsFadeOut(true);
  };

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     handleAnimationEnd();
  //   }, TOAST_REMOVE_DELAY);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  
  // }, []);
  useTimeout(() => {
    setIsFadeOut(true);
  }, TOAST_REMOVE_DELAY)

  const handleAnimationEnd = () => {
    if (isFadeOut) {
      removeToast(id);
    }
  }
  return (
    <ToastStyle className={isFadeOut ? "fade-out" : "fade-in"} onAnimationEnd={handleAnimationEnd}>
      <p>
        {type === "info" && <FaInfoCircle />}
        {type === "error" && <FaBan />}
        {message}
      </p>
      <button onClick={handlerRemoveToast}>
        <FaPlus />
      </button>
    </ToastStyle>
  );
}

const ToastStyle = styled.div`
  @keyframes fade-in {
    from {
      opacity: 0;
    } to {
      opacity: 1;
    }
  }

  @keyframes fade-out {
    from {
      opacity: 1;
    } to {
      opacity: 0;
    }
  }
  &.fade-in {
    animation: fade-in 0.3s ease-in-out forwards;
  }
  &.fade-out {
    animation: fade-out 0.3s ease-in-out forwards;
  }

  background: ${({ theme }) => theme.color.background};
  padding: 12px;
  border-radius: ${({ theme }) => theme.borderRadius.default};

  dipslay: flex;
  justify-content: space-between;
  algin-items: start;
  gap: 24px;
  opacity: 0;
  transition: all 0.3s ease-in-out;

  p {
    color: ${({ theme }) => theme.color.text};
    line-height: 1;
    margin: 0;
    flex: 1;

    display: flex;
    align-items: end;
    gap: 4px;
  }

  button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0;

    svg {
      transform: rotate(45deg);
    }
  }
`;
