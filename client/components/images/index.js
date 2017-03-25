'use strict';

const el = require('../../../server/lib/create-element');

let state = {
    maxItemsToShow: 6,
    items: [],
    status: 'loaded',
    queryUrl: '',
};


//TODO click enter in query-field.
// do fetch, render 6 imaages from data recieved. replace element. elem 1
// do fetch from rimg-data, render those images. elem 2
// later, make those images clickable, should also re-render elem 1 + 2

//TODO take text from input-field, pass into google-query.
//TODO take response and render images in a div.
function imageQuery(ele, query) {
    function init () {
        update();
        fetch(serviceUri, { credentials: 'include' })
            .then(res => updateStateFromResponse(state, res))
            .then(newState => { state = newState; })
            .then(update);
    }

    function update (query) {
        let newEle = null;
        fetch(serviceUri, { credentials: 'include' })
            .then(res => updateStateFromResponse(state, res))
            .then(newState => { state = newState; })
            .then(update);
        switch (state.status) {
            case 'loaded':
            case 'cleared':
                newEle = listView(state, clearLastSearches);
                break;
            default:
                newEle = errorView();
                break;
        }
        if (newEle) {
            ele.parentNode.replaceChild(newEle, ele);
            ele = newEle;
        }
    }

}

function constructQueryUrl(query, rimg) {
    const q = query ? 'q=' + query : '';
    return`https://www.google.com/search?${ q }&tbm=isch&tbs=${ rimg }`;
}

function update (ele, query, rimg) {
    let newEle = null;
    const queryUrl = constructQueryUrl(query, rimg);
    fetch(queryUrl)
        .then(res => updateStateFromResponse(state, res))
        .then(newState => { state = newState; })
        .then(update);
    switch (state.status) {
        case 'loaded':
        case 'cleared':
            newEle = listView(state, clearLastSearches);
            break;
        default:
            newEle = errorView();
            break;
    }
    if (newEle) {
        ele.parentNode.replaceChild(newEle, ele);
        ele = newEle;
    }
}

function updateStateFromResponse (oldState, response) {
    if (response.ok) {
        console.log(response);
        return response
            .json()
            .then(items => Object.assign({}, oldState, { items, status: 'loaded' }));
    } else if (response.status === 401) {
        return Object.assign({}, oldState, { status: 'unauthorized' });
    } else {
        return Object.assign({}, oldState, { status: 'errored' });
    }
}

function errorView () {
    return el('p', null, 'For øyeblikket klarte vi ikke å hente dine siste søk');
}

function listView (state, clearCallback) {
    if (state.status === 'cleared' || state.items.length === 0) {
        return el('p', { tabindex: '-1' },
            'Etter hvert som du gjør søk på FINN vil de dukke opp her.');
    } else {
        return el('div', null,
            el('ol', null, state.items.slice(0, state.maxItemsToShow).map(e => listItem(e, state.baseUrl))),
            el('div.rightify', null,
                el('button.b1.blank.r-phl', { type: 'button', onclick: clearCallback },
                    'Tøm lista'
                )
            )
        );
    }
}

function listItem ({ title, url }, baseUrl ) {
    return el('li', null,
        el('a.truncate.blockify.pvs', { href: `${baseUrl}${url}` }, title)
    );
}

module.exports = lastSearchesBox;
