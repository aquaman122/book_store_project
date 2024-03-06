import Title from "@/components/common/Title";
import MainNewBooks from "@/components/main/MainNewBooks";
import MainReview from "@/components/main/MainReview";
import { useMain } from "@/hooks/useMain";
import React from "react";
import styled from "styled-components";

export default function Home() {
  const { reviews, newBooks } = useMain();

  return (
    <HomeStyle>
      {/* banner */}

      {/* best seller */}
      <section className="section">
        <Title size="large">베스트셀러</Title>
      </section>
      {/* new Books */}
      <section className="section">
        <Title size="large">신간 안내</Title>
        <MainNewBooks books={newBooks} />
      </section>
      {/* reviews */}
      <section className="section">
        <Title size="large">리뷰</Title>
        <MainReview reviews={reviews} />
      </section>
    </HomeStyle>
  );
}

const HomeStyle = styled.div`
  color: ${({ theme }) => theme.$1};
`;

