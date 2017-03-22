'use strict';

const { str } = require('envalid');
const entries = require('object.entries');
const cdnUrls = require('../../cdn-urls.json');

const massageKey = key => key
    .replace('@finn-no/', '')
    .replace('-', '_')
    .toUpperCase();

const squashObject = (accumulator, curr) => Object.assign(accumulator, curr);

module.exports = entries(cdnUrls)
    .map(([key, value]) => [massageKey(key), value])
    .map(([key, value]) => entries(value)
        .map(([subKey, subValue]) => ({ [`${key}_${massageKey(subKey)}_URL`]: str({ default: subValue }) }))
        .reduce(squashObject)
    )
    .reduce(squashObject);
