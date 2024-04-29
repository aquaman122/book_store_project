import React from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { LIMIT } from "../../constants/pagiation";
import { QUERYSTRING } from "../../constants/querystring";
import { Pagination as IPagination } from "../../models/pagination.model";
import Button from "../common/Button";

interface Props {
  pagination: IPagination;
}

function Pagination({ pagination }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { totalCount, currentPage } = pagination;
  const pages:number = Math.ceil(totalCount / LIMIT);
  
  const handleClickPage = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams) ;

    newSearchParams.set(QUERYSTRING.PAGE, page.toString());

    setSearchParams(newSearchParams);
  }


  return (
    <>
      <PaginationStyle>
        {
          pages > 0 && (
            <ol>
              {
                Array(pages).fill(0).map((_, index) => (
                  <li key={index}>
                    <Button key={index} size="small" scheme={index + 1 === currentPage ? "primary" : "normal"} onClick={() => {
                      handleClickPage(index + 1)}}>
                        {index + 1}
                    </Button>
                  </li>
                ))
              }
            </ol>
          )
        }
      </PaginationStyle>
    </>
  )
}

const PaginationStyle = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  padding: 24px 0;

  ol {
    list-style: none;
    display: flex;
    gap: 8px;
    padding: 0;
    margin: 0;
  }
`;

export default Pagination;
