import React, { Component, Suspense } from "react";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider as StyledThemeProvider } from "styled-components";
import client from "./apollo-client";
import App from "./app";
import theme from "./theme";
import { createGlobalStyle } from "styled-components";
import splitPanelCSS from "./split-panel-style";
import "typeface-open-sans";
import Loading from "./loading";
import { ErrorBoundary } from "./error";
import { ThemeProvider as MajesticThemeProvider } from "./context/ThemeContext";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Open sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 13px;
    margin: 0;
    padding: 0;
    background-color: var(--color-background);
    color: var(--color-text-primary);
    transition: background-color 250ms ease-in-out, color 250ms ease-in-out;
  }

  /* Respect prefers-reduced-motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  ${splitPanelCSS}
`;

export default class Container extends Component {
  render() {
    return (
      <React.Fragment>
        <MajesticThemeProvider defaultTheme="dark">
          <StyledThemeProvider theme={theme}>
            <GlobalStyle />
            <ApolloProvider client={client}>
              <Suspense fallback={<Loading />}>
                <ErrorBoundary>
                  <App />
                </ErrorBoundary>
              </Suspense>
            </ApolloProvider>
          </StyledThemeProvider>
        </MajesticThemeProvider>
      </React.Fragment>
    );
  }
}
