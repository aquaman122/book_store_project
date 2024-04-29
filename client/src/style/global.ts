import { createGlobalStyle } from 'styled-components';
import "sanitize.css";
import { ThemeName } from './theme';

interface Props {
  themeName: ThemeName;
}

export const GlobalStyle = createGlobalStyle<Props>`
  body {
    padding: 0;
    margin: 0;
    background-color: ${({ theme }) => (theme.name === "light" ? "white" : "black")};
  }

  h1 {
    margin: 0;
  }

  * {
  color: ${({ theme }) => (theme.name === "light" ? "black" : "white")};
  }
`