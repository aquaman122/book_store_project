import React from "react";
import styled from "styled-components";

export default function Home() {
  return (
    <HomeStyle>
      <h2>Home</h2>
    </HomeStyle>
  );
}

const HomeStyle = styled.div`
  color: ${({ theme }) => theme.$1};
`;

