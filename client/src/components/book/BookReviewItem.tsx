import { BookReviewItem as IBookReviewItem} from "@/models/book.model";
import { formatDate } from "@/utils/format";
import React from "react";
import { FaStar } from "react-icons/fa";
import styled from "styled-components";

interface Props {
  review: IBookReviewItem;
}

const StarSpan = styled.span`
  padding: 0 0 0 8px;
  svg {
    fill: ${({ theme }) => theme.color.primary};
  }
`

const Star = (props: Pick<IBookReviewItem, "score">) => {
  return (
    // 화면 내용
    <StarSpan>
      {Array.from({ length: props.score }).map((_, idx) => (
        <span key={idx}><FaStar /></span>
      ))}
    </StarSpan>
  )
} 

export default function BookReviewItem({ review }: Props) {
  return (
    <BookReviewItemStyle>
      <header className="review">
        <div>
          <span>{review.userName}</span>
          <Star score={review.score} />
        </div>
        <div>{formatDate(review.createdAt)}</div>
      </header>
      <div className="content">
        <p>
          {review.content}
        </p>
      </div>
    </BookReviewItemStyle>
  );
}

const BookReviewItemStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: ${({ theme }) => theme.borderRadius.default};

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.secondary};
    padding: 0;
  }

  .content {
    p {
      font-size: 1rem;
      line-height: 1.5;
      margin: 0;
    }
  }
`;
