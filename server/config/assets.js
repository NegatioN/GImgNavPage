'use strict';

const path = require('path');
const { str } = require('envalid');

module.exports = {
    ASSET_MAP_PATH: str({
        desc: 'Path to asset map, relative to project root',
        default: path.resolve(__dirname, ...('../../asset-map.json'.split('/'))),
    }),
    ASSETS_CDN_BASE: str({
        desc: 'Base url for CDN resources',
        default: 'https://static.finncdn.no/_c/node-example-app',
        // If you use hashed assets, set this to `build`
        devDefault: '',
    }),
};
