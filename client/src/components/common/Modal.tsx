import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FaPlus } from "react-icons/fa";
import { createPortal } from "react-dom";

interface Props {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ children, isOpen, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleModalClose = () => {
    setIsFadingOut(true);
  }

  const handelOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleModalClose();
    }
  }

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      handleModalClose();
    }
  }

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeydown);
    } else {
      window.removeEventListener("keydown", handleKeydown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    }
  }, [isOpen]);
  if (!isOpen) return null;

  const handleAnimationEnd = () => {
    if (isFadingOut) {
      onClose();
      setIsFadingOut(false);
    }
  }

  return createPortal(
    <ModalStyle onClick={handelOverlayClick} className={isFadingOut ? "fade-out" : "fade-in"}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="modal-body" ref={modalRef}>
        <div className="modal-contents">{children}</div>  
        <button className="modal-close" onClick={handleModalClose}><FaPlus /></button>
      </div>
    </ModalStyle>
    , document.body
  );
}

const ModalStyle = styled.div`
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

  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.5);

  .modal-body {
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: #fff;
    max-width: 80%;
    transform: translate(-50%, -50%);
    padding: 56px 32px 32px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  .modal-close {
    position: absolute;
    top: 0px;
    right: 0px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 12px;
    margin: 0;
    svg {
      width: 24px;
      height: 24px;
      transform: rotate(45deg);
    }
  }
`;
