'use strict';

const controllerist = require('./controllerist');
/*
const { globalSearchMobile, globalSearchDesktop } = require('./components/global-search');

function recommendationsController (ele) {
    const siteUrl = ele.getAttribute('data-site-url');
    const imgCdnUrl = ele.getAttribute('data-image-cdn-url');
    const title = ele.getAttribute('data-title');
    const market = ele.getAttribute('data-market');
    const injectMeta = (ele.getAttribute('data-meta-rec') === 'true');

    marketRecs(ele, siteUrl, imgCdnUrl, injectMeta, {
        title,
        market,
        position: `${market}_front`,
    });
}
*/

function main () {
    const c = controllerist();
    //c.register('broadcast', broadcastController);
    console.log("Hello console");

    c.run(document);
}

main();
