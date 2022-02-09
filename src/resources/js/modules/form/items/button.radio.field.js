const ButtonField = require("./button.field");


class ButtonRadioField extends ButtonField {

    static NAME = "radio";

    /**
     * @param {Event} e
     */
    fieldOnChange(e) {
        this.runChangeEvent(e, this);
        let
            elem = $(e.currentTarget),
            label = elem.prev()
        ;
        if(elem.is(":" + ButtonField.LABEL_CLASS)) {
            this.dom.find("label").removeClass(ButtonField.LABEL_CLASS);
            label.addClass(ButtonField.LABEL_CLASS);
        } else {
            label.removeClass(ButtonField.LABEL_CLASS);
        }
        super.fieldOnChange(e);
    }

}

module.exports = ButtonRadioField;