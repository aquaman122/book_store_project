import React, { useState } from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  toggleButton: React.ReactNode;
  isOpen?: boolean;
}

export default function Dropdown({ children, toggleButton, isOpen = false }: Props) {
  const [open, setOpen] = useState(isOpen);

  return (
    <DropdownStyle>
      <button className="toggle" onClick={() => setOpen(!open)}>
        {toggleButton}
      </button>
      {open && <div className="panel">{children}</div>}
    </DropdownStyle>
  );
}

const DropdownStyle = styled.div``;
