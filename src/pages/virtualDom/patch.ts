import { Obj, VirtualElement, render, setAttr } from "./element";
import { ATTRS, REPLACE, REMOVE, TEXT } from "./diff";
let index = 0;
let allPatches: Obj;

/**
 * 修改dom元素
 * @param node
 * @param patches
 */

const doPatch = (node: HTMLElement, patches: any[]) => {
  patches.forEach((patch) => {
    switch (patch.type) {
      case ATTRS:
        Object.keys(patch.attrs).forEach((key) => {
          if (patch.attrs[key]) {
            setAttr(node, key, patch.attrs[key]);
          } else {
            node.removeAttribute(key);
          }
        });
        break;
      case REPLACE:
        let newNode =
          patch.newNode instanceof VirtualElement
            ? render(patch.newNode)
            : document.createTextNode(patch.newNode);
        node.parentNode?.replaceChild?.(newNode, node);
        break;
      case REMOVE:
        node.parentNode?.removeChild(node);
        break;
      case TEXT:
        node.textContent = patch.text;
        break;
    }
  });
};

const walk = (node: HTMLElement) => {
  let currentPatch = allPatches[index++];
  const childNode = node.childNodes;
  childNode.forEach((item) => walk(item as HTMLElement));
  if (currentPatch) {
    doPatch(node, currentPatch);
  }
};
const patch = (el: HTMLElement, patches: Obj) => {
  allPatches = patches;
  walk(el);
};

export default patch;
