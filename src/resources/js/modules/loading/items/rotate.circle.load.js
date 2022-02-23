const Load = require('./load');

const DEFAULT_SIZE = 100;

class RotateCircleLoad extends Load {

    /**
     * @param {jQuery|HTMLElement} parentDom
     * @param {string|undefined} title
     * @param {number} size
     */
    constructor(parentDom, title = undefined, size = DEFAULT_SIZE) {
        super(parentDom, title);
        let
            circle = $("<div class='loader-rotate-circle'></div>")
        ;
        size = this.parseIntByDefault(size, DEFAULT_SIZE);
        circle.css({
            width : size,
            height : size
        });
        this.dom.find(".loader-animation").html(circle);
    }


}

module.exports = RotateCircleLoad;