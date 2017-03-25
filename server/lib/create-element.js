/**
 * Create an element.
 *
 * @param {String} name The element type name, plus optional classes
 * @param {Object} attributes The element's attributes
 * @param {...any} content The element's content
 */
function createElement (name, attributes, ...content) {
    if (typeof name != 'string') {
        throw new TypeError('The name argument must be a string');
    }

    const defaultNamespace = document.documentElement.namespaceURI;

    // Handle class names shortcut
    const [qName, ...classes] = name.split('.');
    const { namespace = defaultNamespace, localName } = getNamespaceParts(qName);
    const ele = document.createElementNS(namespace, localName);

    if (classes.length) {
        ele.classList.add(...classes);
    }

    if (attributes != null) {
        if (typeof attributes != 'object') {
            throw new TypeError('The attributes argument must be an object');
        }

        if (attributes instanceof Node) {
            throw new TypeError('The attributes argument cannot be a Node. Did you forget to pass attributes?');
        }

        Object.entries(attributes).forEach(([qName, value]) => {
            if (value !== null && value !== false) {
                if (value === true) {
                    value = ''; // Treat as boolean attribute
                }

                const { namespace, localName } = getNamespaceParts(qName);

                if (localName.startsWith('on') && typeof value == 'function') {
                    ele.addEventListener(localName.slice(2), value);
                    return;
                }

                // setAttributeNS() with the HTML namespace doesn't set IDL attributes
                if (namespace) {
                    ele.setAttributeNS(namespace, localName, value);
                } else {
                    ele.setAttribute(localName, value);
                }
            }
        });
    }

    content.filter(value => value !== null)
        .reduce((prev, curr) => prev.concat(curr), []) // flatten
        .forEach(value => ele.appendChild(toNode(value)));
    ele.normalize();

    function toNode (value) {
        switch (typeof value) {
            case 'boolean':
            case 'number':
            case 'string':
                return document.createTextNode(value.toString());

            case 'undefined':
                return document.createTextNode('undefined');

            default:
                if (value instanceof Node) {
                    return value;
                }
        }

        throw new TypeError(`Argument of type '${typeof value}' cannot be used as content.`);
    }

    function getNamespace (prefix) {
        switch (prefix) {
            case 'html': return 'http://www.w3.org/1999/xhtml';
            case 'svg': return 'http://www.w3.org/2000/svg';
            case 'xlink': return 'http://www.w3.org/1999/xlink';
        }
    }

    function getNamespaceParts (qName) {
        if (qName.indexOf(':') !== -1) {
            const [prefix, localName] = qName.split(':');
            const namespace = getNamespace(prefix);
            if (!namespace) {
                throw Error(`No namespace found for prefix "${prefix}"`);
            }
            return { namespace, localName };
        }

        return { localName: qName };
    }

    return ele;
}

export default createElement;
