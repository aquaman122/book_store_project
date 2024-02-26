import React from "react";
import styled from "styled-components";
import { useCategory } from "../../hooks/useCategory";
import Button from "../common/Button";
import { useSearchParams } from 'react-router-dom';


function BooksFilter() {
  const { category } = useCategory();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleCategory = (id: number | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (id === null) {
      newSearchParams.delete("category_id");
    } else {
      newSearchParams.set("category_id", id.toString());
    }

    setSearchParams(newSearchParams);
  };

  const handleNew = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (newSearchParams.get("news")) {
      newSearchParams.delete("news");
    } else {
      newSearchParams.set("news", "true");
    }

    setSearchParams(newSearchParams);
  };

  return (
    <>
      <BooksFilterStyle>
        <div className="category">
          { category.map((item) => (
            <Button size="small" scheme={item.isActive ? "primary" : "normal"} key={item.id} onClick={() => handleCategory(item.id)} >
              {item.name}
            </Button>
          ))}
        </div>
        <div className="new">
          <Button size="small" scheme={searchParams.get("news") ? "primary" : "normal"} onClick={() => handleNew()}>
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
