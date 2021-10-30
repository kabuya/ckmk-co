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
     * @param {Event} e
     */
    fieldOnChange(e) {
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

}

module.exports = ButtonField;