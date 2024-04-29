import React from "react";
import styled from "styled-components";
import {FaSmileWink } from "react-icons/fa";
import { Link } from "react-router-dom";
import Empty from "../common/Empty";

function BooksEmpty() {
  return (
    <>
      <Empty
        title="검색결과가 없습니다" 
        icon={<FaSmileWink />} 
        description={<Link to="/books">전체 검색 결과로 이동</Link>} />
    </>
  )
}

const BooksEmptyStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 120px 0;

  .icon {
    svg {
      font-size: 4em;
      fill: #ccc;
    }
  }
`;

export default BooksEmpty;
