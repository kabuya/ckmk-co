const Field = require("./field");
const LABEL_CLASS = "checked";


class ButtonField extends Field {

    static LABEL_CLASS = LABEL_CLASS;

    /**
     * @param {Form} form
     * @param {jQuery|HTMLElement} dom
     */
    constructor(form, dom) {
        super(form, dom);
        delete this.min;
        delete this.max;
    }

    /**
     * @param {jQuery|HTMLElement|undefined} label
     * @return {boolean}
     */
    labelIsChecked(label) {
        label = label || this.dom.find("label");
        return label.hasClass("checked");
    }

    /**
     * @param {jQuery|HTMLElement|undefined} label
     * @return {boolean}
     */
    labelIsOnFocus(label) {
        label = label || this.dom.find("label");
        return label.hasClass("focus");
    }

    /**
     * @param {Event} e
     */
    addFocusOnLabel(e) {
        let
            label = $(e.currentTarget).next()
        ;
        if(this.labelIsOnFocus(label)) return false;
        label.addClass("focus");
        return true;
    }

    /**
     * @param {Event} e
     */
    removeFocusOnLabel(e) {
        let
            label = $(e.currentTarget).next()
        ;
        if(!this.labelIsOnFocus(label)) return false;
        label.removeClass("focus");
        return true;
    }

    /**
     * @param {Event} e
     */
    fieldOnChange(e) {
        $(e.currentTarget).prev().prev().focus();
        if(this.dom.find("input").is(":" + LABEL_CLASS)) {
            if(!this.dom.hasClass("active")) {
                this.dom.addClass("active");
            }
        } else {
            if(this.dom.hasClass("active")) {
                this.dom.removeClass("active");
            }
        }
    }

    setEvents() {
        super.setEvents();
        if(!this.isDisable()) {
            let
                btn = this.dom.find(".button-no-action")
            ;
            btn.on("click", (e) => {
                $(e.currentTarget).next().click();
            });
            btn.on("focusin", this.addFocusOnLabel.bind(this));
            btn.on("focusout", this.removeFocusOnLabel.bind(this));
        }
    }

}

module.exports = ButtonField;