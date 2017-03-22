'use strict';

/**
 * This file is the entry point for all frontend javascript.
 * It is generated on the fly during development.
 * During building, the bundle is created as a static
 * asset and included with the other assets that are
 * uploaded to the CDN.
 */

window.addEventListener('load', () => {
    if (process.env.NODE_ENV === 'production') {
        console.log('production');
    } else {
        console.log('development');
    }

    console.log('Hello world from frontend bundle');
});
