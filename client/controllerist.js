'use strict';

function runOnRoot (rootElem, controllers) {
    Array
        .from(rootElem.querySelectorAll('[data-ctrl]'))
        .forEach(e => runOnElement(e, controllers));
}

function runOnElement (ele, controllers) {
    ele.getAttribute('data-ctrl')
        .trim()
        .split(/\s+/g)
        .forEach(cName => tryToRun(ele, cName, controllers));
}

function tryToRun (ele, cName, controllers) {
    const controller = controllers[cName];
    if (controller) {
        try {
            controller(ele);
        } catch (e) {
            console.error(e);
        }
    } else {
        throw new Error(`Controller named "${cName}" not found.`);
    }
}

function makeControllerist (rootElem = document) {
    const controllers = {};
    return {
        register: (cName, controller) => { controllers[cName] = controller; },
        run: () => runOnRoot(rootElem, controllers),
    };
}

module.exports = makeControllerist;
