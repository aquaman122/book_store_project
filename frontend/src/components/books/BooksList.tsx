import React from "react";
import styled from "styled-components";
import { Book } from "../../models/book.model";
import BookItem from "./BookItem";

const dummyBook: Book = {
  id: 1,
  title: "Dummy Book",
  img: 5,
  category_id: 1,
  summary: "Dummy Summary",
  author: "Dummy Author",
  price: 10000,
  likes: 1,
  form: "paperback",
  isbn: "Dummy ISBN",
  detail: "Dummy Detail",
  pages: 100,
  contents: "Dummy Contents",
  pubDate: "2021-01-01",
}

function BooksList() {
  return (
    <>
    <BooksListStyle>
      <BookItem book={dummyBook} />
    </BooksListStyle>
    </>
  )
}

const BooksListStyle = styled.div`

`;

export default BooksList;
