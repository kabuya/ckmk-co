const NOT_FOUND_HIDE_CLASS = "not-found";

/**
 * @property {TextDatalist} container
 * @property {string} value
 * @property {jQuery|HTMLElement} dom
 */
class TextDatalistItem {

    /**
     * @param {TextDatalist} container
     * @param {string} value
     * @param {jQuery|HTMLElement} dom
     */
    constructor(container, value, dom) {
        this.container = container;
        this.value = value;
        this.dom = dom;

        this.setEvents();
    }

    /**
     * @return {boolean}
     */
    isVisible() {
        return !this.isUnVisible();
    }

    /**
     * @return {boolean}
     */
    isUnVisible() {
        return this.dom.hasClass(NOT_FOUND_HIDE_CLASS);
    }

    /**
     * @return {boolean}
     */
    show() {
        if(this.isVisible()) return false;
        this.dom.removeClass(NOT_FOUND_HIDE_CLASS);
        return true;
    }

    /**
     * @return {boolean}
     */
    hide() {
        if(this.isUnVisible()) return false;
        this.dom.addClass(NOT_FOUND_HIDE_CLASS);
        return true;
    }

    defaultHtml() {
        let
            currentHtml = this.dom.html()
        ;
        if(currentHtml !== this.value) {
            this.dom.html(this.value);
        }
    }

    /**
     * @param {string} value
     * @return {boolean}
     */
    match(value) {
        this.defaultHtml();
        this.show();
        if(co.isSet(value)) {
            if(this.container.isChoiceControl()) {
                let
                    matched = co.search(value, this.value)
                ;
                if(co.isSet(matched) && !this.value.in(value)) {
                    this.dom.html(matched);
                    return true;
                } else {
                    this.hide();
                }
            } else {
                return this.value/*.removeAccent()*/.in(value/*.removeAccent()*/);
            }
        }
        return false;
    }

    /**
     * @param {Event} e
     */
    setChoice(e) {
        this.container.setChoiceValue(this.value);
    }

    setEvents() {
        if(this.container.isChoiceControl()) {
            let
                this_o = this
            ;
            this.dom.on("click", (e) => {
                this_o.setChoice(e);
            });
        }
    }

}

module.exports = TextDatalistItem;