import { VirtualElement } from "./create-element";

export const renderElement = (vNode: VirtualElement): Element => {
    const $node = document.createElement(vNode.tagName);

    for (const [key, value] of Object.entries(vNode.attrs)) {
        $node.setAttribute(key, value);
    }

    for (const child of vNode.children) {
        $node.appendChild(render(child));
    }

    return $node;
}

export const render = (node: VirtualElement | string) => {
    if (typeof node === "string") {
        return document.createTextNode(node);
    }

    return renderElement(node);
}