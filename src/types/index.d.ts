
interface ObjectToHTML {
    render: HTMLElement
    unrender: HTMLObject
}

interface o2h {
    render: Function
    undoRender: Function
}
interface HTMLAttribute {
    [key: string]: string
}

interface HTMLObject {
    tagName?: string;
    type?: "element" | "text" | "comment";
    text?: string;
    styles?: { [key: string]: string | number };
    classes?: string | string[];
    attributes?: HTMLAttribute[];
    events?: { [key: string]: Function }[];
    childNodes?: HTMLObject[];
}
