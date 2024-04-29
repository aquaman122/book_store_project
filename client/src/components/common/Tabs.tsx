import React, { useState } from "react";
import styled from "styled-components";

interface TabProps {
  title: string;
  children: React.ReactNode;
}

function Tab({ children }: TabProps) {
  return (
    <>
      {children}
    </>
  )
}

interface TabsProps {
  children: React.ReactNode;
}

function Tabs({ children }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // tab의 포인트 access 할 수 있는 배열로 변환
  const tabs = React.Children.toArray(children) as React.ReactElement<TabProps>[];

  return (
    <TabsStyle>
      <div className="tab-header">
        {
          tabs.map((tab, index) => (
            <button key={index} onClick={() => setActiveIndex(index)} className={activeIndex === index ? "active" : ""}>
              {tab.props.title}
            </button>
          ))
        }
      </div>
      <div className="tab-content">
        {tabs[activeIndex]}
      </div>
    </TabsStyle>
  );
}

const TabsStyle = styled.div`
  .tab-header {
    display: flex;
    gap: 2px;
    border-bottom: 1px solid #ddd;

    button {
      border: none;
      background: #ddd;
      cursor: pointer;
      font-size: 1.25rem;
      font-weight: bold;
      color: ${({ theme }) => theme.color.text};
      border-radius: ${({ theme }) => theme.borderRadius.default} ${({ theme }) => theme.borderRadius.default} 0 0;
      padding: ${({ theme }) => theme.mediaQuery.mobile ? "6px 12px" : "12px 24px"}; 
        12px 24px; 

      &.active {
        color: #fff;
        background: ${({ theme }) => theme.color.primary};
      }
    }
  }

  .tab-content {
    padding: 24px 0;
  }
`;

export { Tab, Tabs };