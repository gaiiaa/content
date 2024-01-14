import React from "react";
import ReactDOM from "react-dom/client";
import * as jsx from "react/jsx-runtime";
import { toJSX } from "../../src";

import markdown from "../content/hello.md";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {toJSX(
      markdown,
      {
        jsx: jsx.jsx,
        jsxs: jsx.jsxs,
        Fragment: jsx.Fragment,
      },
      {
        code: (props) => (console.log(props), (<pre {...props} />)),
      },
    )}
  </React.StrictMode>,
);
