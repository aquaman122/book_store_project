import React from "react";
import styled from "styled-components";
import BooksEmpty from "../components/books/BooksEmpty";
import BooksFilter from "../components/books/BooksFilter";
import BooksList from "../components/books/BooksList";
import BooksViewSwitcher from "../components/books/BooksViewSwitcher";
import Pagination from "../components/books/Pagination";
import Title from "../components/common/Title";

function Books() {
  return (
    <>
      <Title size="large">도서 검색 결과</Title>
      <BooksStyle>
        <BooksFilter />
        <BooksViewSwitcher />
        <BooksList />
        <BooksEmpty />
        <Pagination />
      </BooksStyle>
    </>
  )
}

const BooksStyle = styled.div`

`;

export default Books;
