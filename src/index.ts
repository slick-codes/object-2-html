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

// get key
const toArrayOfKeys: Function = (object: Object) => Object.keys(object)


interface o2h {
    render: Function
    undoRender: Function
}

interface HTMLAttribute {
    [key: string]: string
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
        if (object.innerText) element.innerText = object?.innerText
        // set innerHTML
        if (object.innerHTML) element.innerHTML = object?.innerHTML
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
                    element.addEventListener(key, object.events[key])
                else
                    throw new Error(`"${key}" event should be a function instead got an ${typeof (object.events[key])}`)
        }

        // handle children element
        if (object.children) {
            // convert children to array if it is an object
            if (isObject(object.children)) object.children = [object.children]
            // render child element using recursion
            for (let childElement of object.children) this.render(childElement, element)
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
        const object: Object = new Object()
        // @ts-ignore
        object.tagName = element.tagName.toLowerCase()
        // extract classes
        object.classes = element.className.split(' ')


        const elementChildren: HTMLElement[] = element.children
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