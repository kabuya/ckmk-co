let
    destroyList = []
;

/**
 * @property {jQuery|HTMLElement} parentDom
 * @property {string|undefined} title
 * @property {jQuery|HTMLElement} dom
 * @property {boolean} display
 */
class Load {

    /**
     * @param {jQuery|HTMLElement} parentDom
     * @param {string|undefined} title
     */
    constructor(parentDom, title = undefined) {
        this.dom = $([
            "<div class='loader-content'>",
                "<div class='loader-animation'></div>",
                "<div class='loader-title'></div>",
            "</div>",
        ].join(""));
        this.title = title;
        this.parentDom = $(parentDom);
        this.display = false;
    }

    show() {
        if(!this.display && !this.isDestroyed()) {
            this.display = true;
            this.dom.find(".loader-title").html(this.title);
            this.parentDom.prepend(this.dom);
            return true;
        }
        return false;
    }

    remove() {
        if(this.display && !this.isDestroyed()) {
            this.display = false;
            this.dom.remove();
            return true;
        }
        return false;
    }

    destroy() {
        this.remove();
        if(!this.isDestroyed()) {
            destroyList.push(this);
        }
        return true;
    }

    isDestroyed() {
        return (destroyList.indexOf(this) > -1);
    }

    /**
     * @param {number} size
     * @param {number} defaultSize
     * @return {number}
     */
    parseIntByDefault(size, defaultSize) {
        if(!co.isInt(size) || (size < defaultSize)) {
            size = defaultSize;
        }
        return size;
    }

}

module.exports = Load;