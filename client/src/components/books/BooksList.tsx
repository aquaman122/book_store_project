import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { QUERYSTRING } from "../../constants/querystring";
import { Book } from "../../models/book.model";
import BookItem from "./BookItem";
import { ViewMode } from "./BooksViewSwitcher";

interface Props {
  books: Book[];
}

function BooksList({ books }: Props) {
  const [view, setView] = useState<ViewMode>("grid");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get(QUERYSTRING.VIEW)) {
      setView(params.get(QUERYSTRING.VIEW) as ViewMode);
    }
  }, [location.search]);
  return (
    <>
    <BooksListStyle view={view}>
      {
        books?.map((item) => (
          <BookItem key={item.id} book={item} view={view} />
        ))
      }
    </BooksListStyle>
    </>
  )
}

interface BooksListStyleProps {
  view: ViewMode;
}

const BooksListStyle = styled.div<BooksListStyleProps>`
  display: grid;
  grid-template-columns: ${({ view }) => (view === "grid" ? "repeat(4, 1fr)" : "repeat(1, 1fr)")};
  gap: 24px;

  @media screen AND ${({ theme }) => theme.mediaQuery.mobile} {
    grid-template-columns: ${({ view }) => (view === "grid" ? "repeat(2, 1fr)" : "repeat(1, 1fr)")}
  }

`;

export default BooksList;
