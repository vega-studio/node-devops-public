import React from "react";
import { createRoot } from "react-dom/client";
import "./api";

interface IApp {
  // Insert Application configuration props here
}

const App = React.forwardRef<HTMLDivElement, IApp>(() => {
  return <div>Hello World!!!</div>;
});

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
