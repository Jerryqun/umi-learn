/**
 1、节点类型相同，比较属性 ，产生一个属性补丁包  {type:'ATTRS',attrs:{class:'list-group'}}
 2、删除dom节点，{type:'REMOVE',key:'xxx'}
 3、节点类型不一样，直接替换  {type:'REPLACE':newNode:newNode}
 4、文本变化 {type:'TEXT',text:1111}


问题
1、平级元素互换会导致整个节点重新渲染
2、新增没考虑
 */

import { VirtualElement, Obj, VirtualElementChildren } from "./element";

export const ATTRS = "ATTRS";
export const TEXT = "TEXT";
export const REMOVE = "REMOVE";
export const REPLACE = "REPLACE";
let Index = 0;

const isString = (node: unknown) =>
  Object.prototype.toString.call(node).toLocaleLowerCase() ===
  "[object string]";

/**
 * 类型相同比较属性
 * @param oldAttrs
 * @param newAttrs
 * @returns
 */

const differAttr = (oldAttrs: Obj, newAttrs: Obj) => {
  let patches: Obj = {};
  // 修改或删除的属性
  Object.keys(oldAttrs).forEach((key) => {
    if (oldAttrs[key] !== newAttrs[key]) {
      patches[key] = newAttrs[key]; // 有可能为undefined  因为属性可能被删除
    }
  });
  //增加的属性
  Object.keys(newAttrs).forEach((key) => {
    if (!oldAttrs.hasOwnProperty(key)) {
      patches[key] = newAttrs[key];
    }
  });

  return patches;
};

const differChildren = (
  oldChild: VirtualElementChildren,
  newChild: VirtualElementChildren,
  patches: Obj
) => {
  oldChild.forEach((child, idx) => {
    walk(child, newChild[idx], ++Index, patches);
  });
};

const walk = (
  oldNode: VirtualElement | string,
  newNode: VirtualElement | string,
  index: number,
  patches: Record<string, any>
) => {
  let currentPatches = [];

  // 节点被删除
  if (!newNode) {
    currentPatches.push({ type: REMOVE, index });
  } else if (isString(oldNode) && isString(newNode)) {
    // 都为文本节点时
    if (oldNode !== newNode) {
      currentPatches.push({ type: TEXT, text: newNode });
    }
  } else if (
    // 不为文本节点且类型一致比较属性
    oldNode instanceof VirtualElement &&
    newNode instanceof VirtualElement &&
    oldNode.type === newNode.type
  ) {
    const differAttrNode = differAttr(oldNode.props, newNode.props);
    if (Object.keys(differAttrNode).length) {
      currentPatches.push({ type: ATTRS, attrs: differAttrNode });
    }
    // 遍历子节点
    differChildren(oldNode.children, newNode.children, patches);
    // 节点被替换
  } else {
    currentPatches.push({ type: REPLACE, newNode: newNode });
  }
  if (currentPatches.length) {
    patches[index] = currentPatches;
  }
};

const diff = (oldTree: any, newTree: any) => {
  let patches = {};
  //默认索引 从0开始
  const index = 0;
  // 递归 ，将补丁包的结果放入patches
  walk(oldTree, newTree, index, patches);

  return patches;
};
export default diff;
