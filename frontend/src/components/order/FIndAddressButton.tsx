import React, { useEffect } from "react";
import styled from "styled-components";
import Button from "../common/Button";

interface Props {
  onCompleted: (address: string) => void;
}

const SCRIPT_URL = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

export default function FindAddressButton({ onCompleted }: Props) {

  // script load

  // handler

  // input
  const handleOpen = () => {
    new window.daum.Postcode({
      onComplete: (data: any) => {
        onCompleted(data.address as string);
      }, 
    }).open();
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    }
  }, []);

  return (
    <Button type="button" size="medium" scheme="normal" onClick={(event) => {
      event.preventDefault();
      handleOpen();
    }}>주소 찾기</Button>
  );
}

const FindAddressButtonStyle = styled.div``;