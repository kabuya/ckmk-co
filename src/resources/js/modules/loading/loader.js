const RotateCircleLoad = require('./items/rotate.circle.load');
const BoundLoad = require('./items/bound.load');

class Loader {

    constructor() {

    }

    /**
     * @param {jQuery|HTMLElement} parentDom
     * @param {string|undefined} title
     * @return {RotateCircleLoad}
     */
    rotate(parentDom, title = undefined) {
        return new RotateCircleLoad(parentDom, title);
    }

    /**
     * @param {jQuery|HTMLElement} parentDom
     * @param {string|undefined} type
     * @param {number|undefined} countItems
     * @param {number|undefined} sizeItems
     * @param {number|undefined} interval
     * @param {string|undefined} title
     * @return {BoundLoad}
     */
    bound(
        parentDom,
        type = BoundLoad.BOUND_TYPE_CIRCLE,
        countItems = BoundLoad.DEFAULT_COUNT_ITEMS,
        sizeItems = BoundLoad.DEFAULT_SIZE_ITEMS,
        interval = BoundLoad.DEFAULT_ANIMATION_INTERVAL,
        title = undefined
    ) {
        return new BoundLoad(parentDom, type, countItems, sizeItems, interval, title);
    }

}

module.exports = new Loader;