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
    
    /* Dark theme (default) */
    --color-background: hsl(280, 20%, 8%);
    --color-surface: hsl(280, 15%, 15%);
    --color-text-primary: hsl(0, 0%, 95%);
    --color-text-secondary: hsl(0, 0%, 70%);
    --color-primary: hsl(280, 100%, 50%);
    --color-secondary: hsl(200, 100%, 50%);
    --color-accent: hsl(330, 100%, 50%);
    --color-success: hsl(150, 100%, 45%);
    --color-error: hsl(0, 100%, 50%);
    --color-warning: hsl(40, 100%, 50%);
    --color-border: hsl(280, 10%, 25%);
  }

  html.light {
    --color-background: hsl(0, 0%, 98%);
    --color-surface: hsl(0, 0%, 100%);
    --color-text-primary: hsl(280, 20%, 20%);
    --color-text-secondary: hsl(280, 5%, 40%);
    --color-primary: hsl(280, 90%, 55%);
    --color-secondary: hsl(200, 90%, 55%);
    --color-accent: hsl(330, 90%, 55%);
    --color-success: hsl(150, 80%, 50%);
    --color-error: hsl(0, 100%, 50%);
    --color-warning: hsl(40, 100%, 50%);
    --color-border: hsl(280, 10%, 85%);
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

// Ensure theme is mutable for styled-components (Object.freeze issue fix)
// Deep clone to prevent "Cannot add property children" error
const mutableTheme = JSON.parse(JSON.stringify(theme));

export default class Container extends Component {
  componentDidMount() {
    console.log("✅ Container mounted");
  }

  render() {
    console.log("🔄 Container rendering");
    return (
      <React.Fragment>
        <MajesticThemeProvider defaultTheme="dark">
          <StyledThemeProvider theme={mutableTheme}>
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
