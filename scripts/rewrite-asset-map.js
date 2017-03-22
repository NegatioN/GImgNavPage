'use strict';

const { writeFileSync } = require('fs');
const entries = require('object.entries');

const assetPath = require.resolve('../asset-map.json');
const assetsMap = require(assetPath);

const res = entries(assetsMap)
    .reduce((memo, [key, value]) => Object.assign({}, memo, { [key.replace(/^assets\//, '')]: value.replace(/^build\//, '') }), {});

writeFileSync(assetPath, JSON.stringify(res, null, 4));
