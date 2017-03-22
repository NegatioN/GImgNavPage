'use strict';

const { resolve } = require('path');
const { statSync } = require('fs');
const { makeValidator, EnvError } = require('envalid');

const dir = makeValidator(input => {
        const arr = Array.isArray(input) ? input : [input];

arr.forEach(dir => {
    let stat;

try {
    stat = statSync(dir);
} catch (e) {
    throw new EnvError(`"${dir}" does not exist`);
}

if (!stat.isDirectory()) {
    throw new EnvError(`"${dir}" is not a directory`);
}
});

return arr;
}, 'dir');


module.exports = {
    NUNJUCKS_TEMPLATES_LOCATIONS: dir({
        desc: 'A directory, or list of directories, containing nunjucks templates',
        default: resolve(__dirname, '..', 'views'),
    }),
};
