const Load = require('./load');

const DEFAULT_COUNT_ITEMS = 5;
const DEFAULT_SIZE_ITEMS = 8;
const DEFAULT_ANIMATION_INTERVAL = 150;

const BOUND_TYPE_CIRCLE = "circle";
const BOUND_TYPE_SQUARE = "square";
const BOUND_TYPE_TRIANGLE = "triangle";

const BOUND_TYPES = [
    BOUND_TYPE_CIRCLE,
    BOUND_TYPE_SQUARE,
    BOUND_TYPE_TRIANGLE
];

/**
 * @property {jQuery|HTMLElement} parentDom
 * @property {string} type
 * @property {number} sizeItems
 * @property {number} countItems
 * @property {number} interval
 * @property {string} title
 * @property {number|undefined} intervalAction
 */
class BoundLoad extends Load {


    /**
     * @param {jQuery|HTMLElement} parentDom
     * @param {string|undefined} type
     * @param {number|undefined} countItems
     * @param {number|undefined} sizeItems
     * @param {number|undefined} interval
     * @param {string|undefined} title
     */
    constructor(
        parentDom,
        type = BOUND_TYPE_CIRCLE,
        countItems = DEFAULT_COUNT_ITEMS,
        sizeItems = DEFAULT_SIZE_ITEMS,
        interval = DEFAULT_ANIMATION_INTERVAL,
        title = undefined
    ) {
        super(parentDom, title);
        this.dom.find(".loader-animation").html("<div class='loader-bound'></div>");
        this.type = this.parseType(type, BOUND_TYPE_CIRCLE);
        this.countItems = this.parseIntByDefault(countItems, DEFAULT_COUNT_ITEMS);
        this.sizeItems = this.parseIntByDefault(sizeItems, DEFAULT_SIZE_ITEMS);
        this.interval = this.parseIntByDefault(interval, DEFAULT_ANIMATION_INTERVAL);
        this.title = co.isString(title) ? title : undefined;
        this.setItems();
    }

    show() {
        if(super.show()) {
            let
                this_o = this,
                /**
                 * @type {jQuery|HTMLElement}
                 */
                currentItem = this_o.dom.find(".loader-bound-item:first-child"),
                /**
                 * @type {jQuery|HTMLElement}
                 */
                lastItem
            ;
            this_o.boundItems(currentItem);
            this.intervalAction = setInterval(() => {
                lastItem = currentItem;
                currentItem = currentItem.next();
                if(!currentItem.length) {
                    currentItem = this_o.dom.find(".loader-bound-item:first-child");
                }
                this_o.boundItems(currentItem, lastItem);
            }, this.interval);
            return true;
        }
        return false;
    }

    remove() {
        if(super.remove()) {
            if(co.isNumber(this.intervalAction)) {
                clearInterval(this.intervalAction);
                this.intervalAction = undefined;
            }
            return true;
        }
        return false;
    }

    /**
     * @param {jQuery|HTMLElement} currentItem
     * @param {jQuery|HTMLElement} lastItem
     */
    boundItems(currentItem, lastItem = undefined) {
        currentItem.addClass("to-up");
        setTimeout(() => {
            if(lastItem) {
                lastItem.removeClass("to-up");
            }
        }, (this.interval / 200));
    }

    setItems() {
        let
            loaderBound = this.dom.find(".loader-bound"),
            loaderBoundItem
        ;
        for(let i = 0; i < this.countItems; i++) {
            loaderBoundItem = $("<div class='loader-bound-item'></div>");
            loaderBoundItem.addClass("type-" + this.type);
            if(this.type.in(BOUND_TYPE_TRIANGLE)) {
                loaderBoundItem.css({
                    borderWidth : this.sizeItems
                });
            } else {
                loaderBoundItem.css({
                    width : this.sizeItems,
                    height : this.sizeItems
                });
            }
            loaderBound.append(loaderBoundItem);
        }
    }

    /**
     * @param {string|undefined} type
     * @param {string} defaultType
     * @return {*}
     */
    parseType(type, defaultType) {
        if(BOUND_TYPES.indexOf(type) < 0) {
            type = defaultType;
        }
        return type;
    }

}

BoundLoad.BOUND_TYPE_CIRCLE = BOUND_TYPE_CIRCLE;
BoundLoad.DEFAULT_SIZE_ITEMS = DEFAULT_SIZE_ITEMS;
BoundLoad.DEFAULT_COUNT_ITEMS = DEFAULT_COUNT_ITEMS;
BoundLoad.DEFAULT_ANIMATION_INTERVAL = DEFAULT_ANIMATION_INTERVAL;

module.exports = BoundLoad;