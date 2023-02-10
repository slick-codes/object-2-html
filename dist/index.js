// check if item is an object
const isObject = function (value) {
    return (typeof value === 'object' && value !== null && !Array.isArray(value));
};
const getEventList = function (element) {
    const types = [];
    for (let event in element) {
        if (/^on/.test(event) && typeof element[event] === 'function')
            types.push({ [event]: element[event] });
    }
    return types;
};
// extract inline css from element
function getStyles(element) {
    const attributes = element.getAttribute('style');
    if (!attributes)
        return {};
    let styles = attributes.split(';');
    styles.pop(); // remove empty array
    const styleObj = styles.map((style) => {
        let [rule, value] = style.split(':');
        rule = rule.split('-').map((value, index) => {
            return (index !== 0) ? value[0].toUpperCase() + value.slice(1) : value;
        }).join('');
        return { [rule]: value };
    });
    return styleObj;
}
// get key
const toArrayOfKeys = (object) => Object.keys(object);
const o2h = {
    render(object, parent) {
        var _a, _b;
        // check if object is parsed!
        if (!object)
            throw new Error('you need to parse in an object schema!');
        if (!["element", "comment", "text"].includes(object.type.toLowerCase()))
            throw new Error('first param requires an object of {type: "element" or "text" or "comment"');
        // Element container 
        let node;
        switch (object.type.toLowerCase()) {
            case "element":
                node = document.createElement(object.tagName);
                break;
            case "comment":
                //@ts-ignore
                node = document.createComment((_a = object.text) !== null && _a !== void 0 ? _a : "");
                break;
            case "text":
                //@ts-ignore
                node = document.createTextNode((_b = object.text) !== null && _b !== void 0 ? _b : "");
        }
        let isText = object.type.toLowerCase() === 'text';
        let isElement = object.type.toLowerCase() === 'element';
        if (object.attributes && isElement) {
            // convert object attribute to array of object
            if (isObject(object.attributes))
                object.attributes = [object.attributes];
            // set attribute
            object.attributes.forEach((attribute) => {
                const key = toArrayOfKeys(attribute)[0];
                node.setAttribute(key, attribute[key]);
            });
        }
        if (isElement && object.text) {
            node.appendChild(document.createTextNode(object.text));
        }
        // set classes 
        if (object.classes && isElement)
            node.className = typeof object.classes === 'string' ? object.classes : object.classes.join(" ");
        // Assign style to element
        if (object.style && isElement)
            for (let styleName in object.style) {
                node.style[styleName] = object.style[styleName];
            }
        // handle events 
        if (object.events && isElement) {
            const eventKeys = toArrayOfKeys(object.events);
            for (let key of eventKeys)
                if (typeof (object.events[key]) === 'function')
                    node[`on${key}`] = object.events[key];
                else
                    throw new Error(`"${key}" event should be a function instead got an ${typeof (object.events[key])}`);
        }
        // handle children element
        if (object.childNodes && isElement) {
            // convert children to array if it is an object
            if (isObject(object.childNodes))
                object.children = [object.childNodes];
            // render child element using recursion
            for (let childElement of object.childNodes) {
                this.render(childElement, node);
            }
        }
        if (parent) {
            // append element to parent if parent exsit
            parent.appendChild(node);
            return parent; // return parent to dom
        }
        return node; // return element if parent does not exsit
    },
    undoRender(element) {
        const isText = element instanceof Text;
        const isElement = element instanceof HTMLElement;
        const isComment = element instanceof Comment;
        if ((isElement && isComment && isText))
            throw new Error(`undoRender requires an HTMLElement but got a ${typeof element} instead`);
        // object construct
        const object = {};
        if (isElement)
            object.type = 'element';
        else if (isComment)
            object.type = 'comment';
        else if (isText)
            object.type = 'text';
        if (isText || isComment)
            object.text = element.nodeValue;
        if (isElement)
            object.tagName = element.tagName.toLowerCase();
        // extract classes
        if (isElement)
            object.classes = element.className.split(' ');
        // set attributes
        if (isElement)
            element.getAttributeNames().forEach(attrName => {
                if (!object.attributes)
                    object.attributes = [];
                if (attrName !== 'class')
                    object.attributes.push({ [attrName]: element.getAttribute(attrName) });
            });
        // handle event extraction
        let listeners;
        if (isElement) {
            listeners = getEventList(element);
            object.events = [];
        }
        // headle styles object
        if (isElement) {
            object.styles = getStyles(element);
            for (let listener of listeners) {
                const key = toArrayOfKeys(listener)[0].slice('2');
                object.events[key] = listener[`on${key}`];
            }
        }
        const elementChildren = element.childNodes;
        if (elementChildren) {
            object.childNodes = [];
            for (let child of elementChildren) {
                object.childNodes.push(this.undoRender(child));
            }
        }
        return object;
    }
};
//@ts-ignore
if (typeof exports !== 'undefined') {
    //@ts-ignore
    exports.default = o2h;
    //@ts-ignore
    module.exports = exports.default;
    //@ts-ignore
    module.exports.default = exports.default;
}
