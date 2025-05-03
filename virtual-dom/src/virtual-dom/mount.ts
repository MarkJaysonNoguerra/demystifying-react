export const mount = (node: Element, target: Element) => {
    target.replaceWith(node);

    return node;
}