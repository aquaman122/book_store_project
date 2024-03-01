import React from "react";
import styled from "styled-components";
import { useCategory } from "../../hooks/useCategory";
import Button from "../common/Button";
import { useSearchParams } from 'react-router-dom';
import { QUERYSTRING } from "../../constants/querystring";


function BooksFilter() {
  const { category } = useCategory();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleCategory = (id: number | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (id === null) {
      newSearchParams.delete(QUERYSTRING.CATEGORY_ID);
    } else {
      newSearchParams.set(QUERYSTRING.CATEGORY_ID, id.toString());
    }

    setSearchParams(newSearchParams);
  };

  const handleNew = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (newSearchParams.get(QUERYSTRING.NEWS)) {
      newSearchParams.delete(QUERYSTRING.NEWS);
    } else {
      newSearchParams.set(QUERYSTRING.NEWS, "true");
    }

    setSearchParams(newSearchParams);
  };

  return (
    <>
      <BooksFilterStyle>
        <div className="category">
          { category.map((item) => (
            <Button size="small" scheme={item.isActive ? "primary" : "normal"} key={item.category_id} onClick={() => handleCategory(item.category_id)} >
              {item.categoryName}
            </Button>
          ))}
        </div>
        <div className="new">
          <Button size="small" scheme={searchParams.get(QUERYSTRING.NEWS) ? "primary" : "normal"} onClick={() => handleNew()}>
            신간
          </Button>
        </div>
      </BooksFilterStyle>
    </>
  )
}

const BooksFilterStyle = styled.div`
  display: flex;
  gap: 24px;

  .category {
    display: flex;
    gap: 8px;
  }
`;

export default BooksFilter;
