import React, { useEffect } from "react";
import styled from "styled-components";
import Button from "../common/Button";
import { FaList, FaTh } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { QUERYSTRING } from "../../constants/querystring";

const viewOptions = [
  {
    value: "list",
    icon: <FaList />
  },
  {
    value: "grid",
    icon: <FaTh />
  },
];

export type ViewMode = "grid" | "list";

function BooksViewSwitcher() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSwitch = (value: ViewMode) => {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set(QUERYSTRING.VIEW, value);
    setSearchParams(newSearchParams);
  }

  useEffect(() => {
    if (!searchParams.get(QUERYSTRING.VIEW)) {
      handleSwitch("grid");
    }
  }, []);

  return (
    <>
      <BooksViewSwitcherStyle>
          {
            viewOptions.map((option, idx) => (            
              <Button key={idx} size="small" scheme={searchParams.get(QUERYSTRING.VIEW) === option.value ? "primary" : "normal"} onClick={() => handleSwitch(option.value as ViewMode)}>
                {option.icon}
              </Button>
            ))
          }
      </BooksViewSwitcherStyle>
    </>
  )
}

const BooksViewSwitcherStyle = styled.div`
  display: flex;
  gap: 8px;
  svg {
    fill: #fff;
  }
`;

export default BooksViewSwitcher;
