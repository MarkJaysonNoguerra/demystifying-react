import { VirtualElement } from "./create-element"
import { render } from "./render";

export type DiffReturnType = ($node: Element) => Element | undefined


export const diff = (oldVElement: VirtualElement | string, newVElement?: VirtualElement | string): DiffReturnType => {
    if (newVElement === undefined) {
        return $node => {
            $node.remove();
            return undefined;
        }
    }

    if (typeof newVElement === "string" || typeof oldVElement === "string") {
        if (oldVElement !== newVElement) {
            return ($node) => {
                const newNode = typeof newVElement === "string" ? newVElement : render(newVElement);
                $node.replaceWith(newNode);
                return $node;
            }
        }

        return $node => $node;
    }

    if (newVElement.tagName !== oldVElement.tagName) {
        return ($node) => {
            $node.replaceWith(render(newVElement));
            return $node
        }
    }

    const patchAttrs = diffAttrs(oldVElement.attrs, newVElement.attrs);
    const patchChildrens = diffChildren(oldVElement.children, newVElement.children);

    return ($node) => {
        patchAttrs($node);
        patchChildrens($node);

        return $node;
    }
}

const diffAttrs = (oldAttrs: Record<string, string>, newAttrs: Record<string, string>): DiffReturnType => {
    const patches: DiffReturnType[] = [];

    for (const [k, v] of Object.entries(newAttrs)) {
        patches.push($node => {
            $node.setAttribute(k, v);
            return $node;
        });
    }

    for (const k in oldAttrs) {
        if (!(k in newAttrs)) {
            patches.push($node => {
                $node.removeAttribute(k);
                return $node;
            });
        }
    }

    return $node => {
        for (const patch of patches) {
            patch($node);
        }
        return $node;
    };
};

const diffChildren = (oldVChildren: Array<string | VirtualElement>, newVChildren: Array<string | VirtualElement>): DiffReturnType => {
    const childPatches: DiffReturnType[] = [];
    oldVChildren.forEach((oldVChild, i) => {
        childPatches.push(diff(oldVChild, newVChildren[i]));
    });

    const additionalPatches: DiffReturnType[] = [];
    for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
        additionalPatches.push($node => {
            $node.appendChild(render(additionalVChild));
            return $node;
        });
    }

    return $parent => {
        for (let i = $parent.childNodes.length - 1; i >= 0; i--) {
            childPatches[i]($parent.childNodes[i] as Element);
        }

        for (const patch of additionalPatches) {
            patch($parent);
        }
        return $parent;
    };
};