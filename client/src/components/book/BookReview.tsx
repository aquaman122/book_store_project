import React from "react";
import { BookReviewItemWrite, BookReviewItem as IBookReviewItem } from "@/models/book.model";
import BookReviewItem from "./BookReviewItem";
import styled from "styled-components";
import BookReviewAdd from "./BookReviewAdd";

interface Props {
  reviews: IBookReviewItem[];
  onAdd: (data: BookReviewItemWrite) => void;
}

export default function BookReview({ reviews, onAdd }: Props) {
  return (
    <BookReviewStyle>
      <BookReviewAdd onAdd={onAdd} />
      {reviews.map((review) => (
          <BookReviewItem key={review.id} review={review} />
      ))}
    </BookReviewStyle>
  );
}

const BookReviewStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
