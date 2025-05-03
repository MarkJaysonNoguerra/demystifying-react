export type VirtualElement = {
    tagName: string;
    attrs: Record<string, string>
    children: Array<VirtualElement>
}

export type CreateElementOptions = {
    attrs?: Record<string, string>
    children?: Array<VirtualElement | string>
}

export const createElement = (tagName: string, { attrs = {}, children = [] }: CreateElementOptions = {}): VirtualElement => {
    const vElement = Object.create(null);

    Object.assign(vElement, {
        tagName,
        attrs,
        children
    });

    return vElement;
}