import { useEffect } from "react";
import { createElement, render, renderDom } from "./element";
import patch from "./patch";
import diff from "./diff";

export default () => {
  const virtualDom = createElement(
    "ul",
    {
      class: "ul",
      style: "color:red",
    },
    [
      createElement("li", { class: "li" }, ["a"]),
      createElement("li", { class: "li" }, ["b"]),
      createElement("li", { class: "li" }, ["c"]),
    ]
  );
  const virtualDom1 = createElement(
    "ul",
    {
      class: "ul-group",
      style: "color:red",
    },
    [
      createElement("li", { class: "li" }, ["1"]),
      createElement("li", { class: "li" }, ["b"]),
      createElement("div", { class: "div" }, ["3"]),
    ]
  );
  useEffect(() => {
    const el = render(virtualDom);
    renderDom(document.querySelector("#virtualDom") as HTMLElement, el);
    const patches = diff(virtualDom, virtualDom1);
    // 补丁更新到dom元素
    patch(el, patches);
  }, []);

  return <div id="virtualDom">virtualDom</div>;
};
