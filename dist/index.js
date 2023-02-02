// import type { o2hElement } from './types/index.d'
// check if item is an object
const isObject = function (value) {
    return (!Array.isArray(value) && value === null && typeof value === 'object');
};
// get key
const toArrayOfKeys = (object) => Object.keys(object);
const o2h = {
    parent: null,
    render(object, parent) {
        // check if object is parsed!
        if (!object)
            throw new Error('you need to parse in an object schema!');
        // Element container 
        let element = document.createElement(object.tag);
        // set attributes
        if (object.attributes)
            object.attributes.forEach((attribute) => {
                const key = toArrayOfKeys(attribute)[0];
                element.setAttribute(key, attribute[key]);
            });
        // set innerText
        if (object.innerText)
            element.innerText = object === null || object === void 0 ? void 0 : object.innerText;
        // set innerHTML
        if (object.innerHTML)
            element.innerHTML = object === null || object === void 0 ? void 0 : object.innerHTML;
        // set classes 
        if (object.classes)
            element.className = typeof object.classes === 'string' ? object.classes : object.classes.join(" ");
        // Assign style to element
        if (object.style)
            for (let styleName in object.style) {
                element.style[styleName] = object.style[styleName];
            }
        if (object.events) {
            const eventKeys = toArrayOfKeys(object.events);
            for (let key of eventKeys)
                if (typeof (object.events[key]) === 'function')
                    element.addEventListener(key, object.events[key]);
                else
                    throw new Error(`"${key} event should be a function instead got an ${typeof (object.events[key])}`);
        }
        // handle children element
        if (object.children)
            for (let childElement of object.children)
                if (parent) {
                    // append element to parent if parent exsit
                    parent.appendChild(element);
                    return parent; // return parent to dom
                }
        return element; // return element if parent does not exsit
    },
    undoRender(html) {
        return {};
    }
};
//@ts-ignore
if (typeof exports !== 'undefined') {
    //@ts-ignore
    exports = o2h;
}
