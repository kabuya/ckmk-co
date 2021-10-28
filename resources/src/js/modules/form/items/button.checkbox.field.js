const ButtonField = require("./button.field");


class ButtonCheckboxField extends ButtonField {

    static NAME = "checkbox";

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
            label.addClass(ButtonField.LABEL_CLASS);
        } else {
            label.removeClass(ButtonField.LABEL_CLASS);
        }
        super.fieldOnChange(e);
    }

}

module.exports = ButtonCheckboxField;