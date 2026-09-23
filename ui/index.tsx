import React from "react";
import { createRoot } from "react-dom/client";
import Container from "./container";

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
root.render(<Container />);

if ((module as any).hot) {
  (module as any).hot.accept("./container", () => {
    root.render(<Container />);
  });
}
