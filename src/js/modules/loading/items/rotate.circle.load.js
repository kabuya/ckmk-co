const Load = require('./load');

const DEFAULT_SIZE = 10;

class RotateCircleLoad extends Load {

    /**
     * @param {jQuery|HTMLElement} parentDom
     * @param {number} size
     * @param {string|undefined} title
     */
    constructor(parentDom, size = DEFAULT_SIZE, title = undefined) {
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