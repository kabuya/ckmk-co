const Field = require("./field");
const EMAIL_REGEXP = "^[a-z0-9\\.\\-\\_]+\\@[a-z0-9\\.\\-\\_]+\\.[a-z]{2,}$";

const ERROR_INVALID = "form.email.invalid";

class EmailField extends Field {

    static NAME = "email";


    /**
     * @param {Form} form
     * @param {jQuery|HTMLElement} dom
     */
    constructor(form, dom) {
        super(form, dom);
        this.dom.find("input").attr("type", "text");
    }

    checkValue() {
        return this.isValidEmail();
    }

    /**
     * @param {Event} e
     */
    fieldOnFocusOut(e) {
        this.runFocusoutEvent(e, this);
        let
            elem = $(e.currentTarget)
        ;
        this.isValidEmail(elem, true);
        this.dom.removeClass("focus");
    }

    /**
     * @param {jQuery|HTMLElement|undefined} domValue
     * @param {boolean} emptyErrorDisable
     * @return {boolean}
     */
    isValidEmail(domValue = undefined, emptyErrorDisable = false) {
        domValue = domValue || this.dom.find("input");
        let
            regexp = new RegExp(EMAIL_REGEXP, "i"),
            value = domValue.val()
        ;
        if(value) {
            if(!regexp.test(value)) {
                this.dom
                    .removeClass("active")
                    .addClass("error")
                ;
                this.setError({message : this.getErrorMessage(ERROR_INVALID)});
            } else {
                this.dom
                    .removeClass("error")
                    .addClass("active")
                ;
                this.removeError();
                return true;
            }
        } else {
            if(!emptyErrorDisable) {
                this.setError({message : this.getErrorMessage(Field.ERROR_EMPTY)});
            }
            this.dom.removeClass("active");
        }
        return false;
    }

    initErrorMessages() {
        super.initErrorMessages();

        if(!this.errorMessages[ERROR_INVALID]) {
            this.errorMessages[ERROR_INVALID] = "Invalid email";
        }
    }

}

module.exports = EmailField;