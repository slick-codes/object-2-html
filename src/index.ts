// import type { o2hElement } from './types/index.d'


// custom HTMLElement type
// export type o2hElement = HTMLElement
interface HTMLObject extends Object {

}

// TODO: allow child to inherit the style of parent


interface ObjectToHTML {
    render: HTMLElement
    unrender: HTMLObject
}



// check if item is an object
const isObject: Function = function (value: any): boolean {
    return (typeof value === 'object' && value !== null && !Array.isArray(value))
}

const getEventList: Function = function (element: HTMLElement) {
    const types = [];
    for (let event in element) {
        if (/^on/.test(event) && typeof element[event] === 'function')
            types.push({ [event]: element[event] })
    }
    return types
}

// extract inline css from element
function getStyles(element: HTMLElement): any {

    const attributes = element.getAttribute('style')
    if (!attributes) return {}

    let styles: string[] = attributes.split(';')
    styles.pop() // remove empty array

    const styleObj: any = styles.map((style: any) => {
        let [rule, value] = style.split(':')
        rule = rule.split('-').map((value: string, index: number) => {
            return (index !== 0) ? value[0].toUpperCase() + value.slice(1) : value
        }).join('')

        return { [rule]: value }
    })

    return styleObj
}

// get key
const toArrayOfKeys: Function = (object: Object) => Object.keys(object)
interface o2h {
    render: Function
    undoRender: Function
}
interface HTMLAttribute {
    [key: string]: string
}
interface HTMLObject {
    tagName?: string;
    innerText?: string;
    innerHTML?: string;
    styles?: { [key: string]: string | number };
    classes?: string | string[];
    attributes?: HTMLAttribute[];
    events?: { [key: string]: Function }[];
    children?: HTMLObject[];
}

const o2h: o2h = {
    render(object: any, parent: HTMLElement | undefined): HTMLElement {
        // check if object is parsed!
        if (!object)
            throw new Error('you need to parse in an object schema!')

        if (!object.tagName)
            throw new Error('you need to parse in a tagName to HTMLObject')
        // Element container 
        let element: HTMLElement | null = document.createElement(object.tagName)

        if (object.attributes) {
            // convert object attribute to array of object
            if (isObject(object.attributes)) object.attributes = [object.attributes]
            // set attribute
            object.attributes.forEach((attribute: HTMLAttribute) => {
                const key: string = toArrayOfKeys(attribute)[0]
                element.setAttribute(key, attribute[key])
            })
        }

        // set innerText
        if (object.innerText && !object.children?.length) // prevent duplication
            element.innerText = object?.innerText
        // set innerHTML
        if (object.innerHTML && !object.children?.length) // prevent duplication
            element.innerHTML = object?.innerHTML
        // set classes 
        if (object.classes)
            element.className = typeof object.classes === 'string' ? object.classes : object.classes.join(" ")
        // Assign style to element
        if (object.style)
            for (let styleName in object.style) {
                element.style[styleName] = object.style[styleName]
            }
        // handle events 
        if (object.events) {
            const eventKeys = toArrayOfKeys(object.events)
            for (let key of eventKeys)
                if (typeof (object.events[key]) === 'function')
                    element[`on${key}`] = object.events[key]
                else
                    throw new Error(`"${key}" event should be a function instead got an ${typeof (object.events[key])}`)
        }

        // handle children element
        if (object.children) {
            // convert children to array if it is an object
            if (isObject(object.children)) object.children = [object.children]
            // render child element using recursion
            for (let childElement of object.children) {
                this.render(childElement, element)
            }
        }

        if (parent) {
            // append element to parent if parent exsit
            parent.appendChild(element)
            return parent // return parent to dom
        }
        return element // return element if parent does not exsit
    },
    undoRender(element: HTMLElement): HTMLObject {
        // check if element is type HTML
        if (!(element instanceof HTMLElement))
            throw new Error(`render requires a HTMLElement but got a ${typeof element} instead`)

        // object construct
        const object: HTMLObject = {}

        object.tagName = element.tagName.toLowerCase()
        // extract classes
        object.classes = element.className.split(' ')

        // set innerText 
        if (element.innerText) object.innerText = element.innerText
        if (element.innerHTML) object.innerHTML = element.innerHTML

        // set attributes
        object.attributes = []
        element.getAttributeNames().forEach(attrName => {
            if (attrName !== 'class')
                object.attributes.push({ [attrName]: element.getAttribute(attrName) })
        })

        // handle event extraction
        const listeners: Object[] = getEventList(element)
        object.events = []

        // headle styles object
        object.styles = getStyles(element)
        for (let listener of listeners) {
            const key = toArrayOfKeys(listener)[0].slice('2')
            object.events[key] = listener[`on${key}`]
        }

        const elementChildren: HTMLCollection = element.children
        if (elementChildren) {
            object.children = []
            for (let child of elementChildren) {
                object.children.push(this.undoRender(child))
            }
        }

        return object
    }
}

//@ts-ignore
if (typeof exports !== 'undefined') {
    //@ts-ignore
    exports = o2h
}