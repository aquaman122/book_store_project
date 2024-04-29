import React from "react";
import styled from "styled-components";
import { FaSpinner } from "react-icons/fa";

export default function Loading() {
  return (
    <LoadingStyle>
      <FaSpinner />
    </LoadingStyle>
  );
}

const LoadingStyle = styled.div`
  padding: 40px 0;
  text-align: center;

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  svg {
    width: 50px;
    height: 50px;
    fill: #ccc;
    animation: rotate 1s linear infinite;
  }
`;
