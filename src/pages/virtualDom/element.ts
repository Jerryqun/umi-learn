type VirtualElementChildren = VirtualElement[] | string[];
type Obj = Record<string, any>;

class VirtualElement {
  type: string;
  props: Record<string, any>;
  children: VirtualElementChildren;
  constructor(type: string, props: object, children: VirtualElementChildren) {
    this.type = type;
    this.props = props;
    this.children = children;
  }
}

const createElement = (
  type: string,
  props: object,
  children: VirtualElementChildren
) => {
  return new VirtualElement(type, props, children);
};

export const setAttr = (el: any, key: string, value: string) => {
  switch (key) {
    case "value": {
      if (["input", "textArea"].includes(el.tagName.toLocaleLowerCase())) {
        el.value = value;
      } else {
        el.setAttribute(key, value);
      }
      break;
    }
    case "style":
      el.style.cssText = value;
      break;
    default:
      el.setAttribute(key, value);
  }
};

const renderDom = (target: HTMLElement, el: HTMLElement) => {
  target?.appendChild(el);
};

const render = (element: VirtualElement) => {
  const el = document.createElement(element.type);
  Object.keys(element.props).forEach((key: string) =>
    setAttr(el, key, element.props[key])
  );

  element.children.forEach((child: VirtualElement | string) => {
    const content =
      child instanceof VirtualElement
        ? render(child)
        : document.createTextNode(child);
    el.appendChild(content);
  });

  return el;
};

export {
  createElement,
  render,
  renderDom,
  VirtualElement,
  Obj,
  VirtualElementChildren,
};
