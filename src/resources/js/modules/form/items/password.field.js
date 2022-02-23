const Field = require("./field");
const PASSWORD_CONTROL_DANGER = "password-danger";
const PASSWORD_CONTROL_WARNING = "password-warning";
const PASSWORD_CONTROL_SUCCESS = "password-success";
const REGEXP_PASSWORD_VALIDATION = [
    "[a-z]+",
    "[A-Z]+",
    "[0-9]+",
    "[A-Za-z0-9]+"
];
const PASSWORD_MIN_LENGTH = 8;

const VALIDATION_MIN_COUNT = 3;

const EVENT_KEYUP = "keyup";
const EVENT_EYE_CLICK = "eye.click";
const EVENT_CONFIRM_FOCUSOUT = "confirm.focusout";
const EVENT_CONFIRM_FOCUSIN = "confirm.focusin";
const EVENT_CONFIRM_KEYUP = "confirm.keyup";
const EVENT_CONFIRM_EYE_CLICK = "confirm.eye.click";

const EVENTS = [
    EVENT_KEYUP,
    EVENT_EYE_CLICK,
    EVENT_CONFIRM_FOCUSOUT,
    EVENT_CONFIRM_FOCUSIN,
    EVENT_CONFIRM_KEYUP,
    EVENT_CONFIRM_EYE_CLICK
];

const ERROR_INVALID = "form.password.invalid";
const ERROR_UNCONFIRMED = "form.password.unconfirmed";

const ERRORS = [
    ERROR_INVALID,
    ERROR_UNCONFIRMED
];


/**
 * @property {boolean} confirm
 * @property {number} generateTimeOut
 */
class PasswordField extends Field {


    static NAME = "password";

    /**
     * @param {Form} form
     * @param {jQuery|HTMLElement} dom
     */
    constructor(form, dom) {
        super(form, dom);
        this.addAcceptedEvents(EVENTS);
        // co.log(this);
    }

    isToConfirm() {
        return this.confirm;
    }

    /**
     * @param {Event} e
     */
    confirmOnFocusIn(e) {
        this.run(EVENT_CONFIRM_FOCUSIN, e, this);
        let
            elem = $(e.currentTarget),
            parent = elem.parent()
        ;
        if(!parent.hasClass("error") && !parent.hasClass("active")) {
            this.form.dom.find(".field-container").removeClass("focus");
            if(!elem.val()) {
                parent.addClass("active");
            }
        }
        parent.addClass("focus");
    }

    /**
     * @param {Event} e
     */
    confirmOnFocusOut(e) {
        this.run(EVENT_CONFIRM_FOCUSOUT, e, this);
        let
            elem = $(e.currentTarget),
            parent = elem.parent()
        ;
        if(!parent.hasClass("error") && parent.hasClass("active")) {
            if(!elem.val()) {
                parent.removeClass("active");
            }
        }
        if(!elem.val()) {
            if(this.dom.hasClass("error")) {
                parent.removeClass("active");
            } else {
                parent.removeClass("active error");
            }
        }
        parent.removeClass("focus");
    }

    /**
     * @param {Event} e
     */
    confirmOnKeyUp(e) {
        this.run(EVENT_CONFIRM_KEYUP, e, this);
        let
            elem = $(e.currentTarget),
            baseElem = this.dom.find(".field-item > input")
        ;
        return this.checkPasswords(baseElem, elem);
    }

    /**
     * @param {Event} e
     */
    disableCopyOrPaste(e) {
        e.preventDefault();
        return false;
    }

    /**
     * @param {Event} e
     */
    generatePassword(e) {
        let
            this_o = this,
            generatedAlert = this.dom.find(".password-generated-alert"),
            generate = co.generate(16)
        ;
        this.dom
            .find("input")
            .val(generate)
            .trigger("change")
        ;
        co.copy(generate);
        if(this.generateTimeOut) {
            clearTimeout(this.generateTimeOut);
            this.generateTimeOut = undefined;
        }
        generatedAlert.html("Password generated <i class='fa fa-check-square-o'></i>");
        this.generateTimeOut = setTimeout(() => {
            generatedAlert.html("");
        }, 3000);
        return true;
    }

    /**
     * @param {Event} e
     */
    fieldOnKeyUp(e) {
        this.run(EVENT_KEYUP, e, this);
        let
            elem = $(e.currentTarget),
            confirmElem = this.dom.find(".field-confirm > input"),
            value = elem.val(),
            pwdLevel = this.dom.find(".password-level"),
            pwdSquares = pwdLevel.find(">div"),
            classSquare, count
        ;

        pwdSquares.children()
            .removeClass(PASSWORD_CONTROL_DANGER)
            .removeClass(PASSWORD_CONTROL_WARNING)
            .removeClass(PASSWORD_CONTROL_SUCCESS)
        ;

        if(value) {
            pwdLevel.removeClass("hide");
            count = this.getCountValidation(value);
            classSquare = this.getClassSquare(count, value);
            $.each(pwdSquares.children(), (key, item) => {
                $(item).addClass(classSquare);
                if((key + 1) === count) return false;
            });
        } else {
            pwdLevel.addClass("hide");
        }
        return this.checkPasswords(elem, confirmElem);
    }

    /**
     * @param {string} value
     * @return {boolean}
     */
    validate(value) {
        return (this.getCountValidation(value) > VALIDATION_MIN_COUNT);
    }

    /**
     * @param {string} value
     * @return {int}
     */
    getCountValidation(value) {
        let
            count = 0
        ;
        REGEXP_PASSWORD_VALIDATION.forEach((regexp, key) => {
            regexp = new RegExp(regexp, "g");
            if(key === 3) {
                if(value.replace(regexp, "")) {
                    count++;
                }
            } else {
                if(regexp.test(value)) {
                    count++;
                }
            }
        });
        if(value.length >= PASSWORD_MIN_LENGTH) {
            count++;
        }
        return count;
    }

    /**
     * @return {boolean}
     */
    checkValue() {
        let this_o = this;
        this.dom.find("input").each((k, _input) => {
            _input = $(_input);
            this_o.toggleShowValue(_input, _input.next(), true);
        });
        if(this.isToConfirm()) {
            let
                base = this.dom.find(".field-item > input"),
                confirm = this.dom.find(".field-confirm > input")
            ;
            if(!base.val()) {
                this.setError({message : this.getErrorMessage(Field.ERROR_EMPTY)});
                return false;
            } else if(!this.validate(base.val())) {
                this.setError({message : this.getErrorMessage(ERROR_INVALID)});
                return false;
            } else if(!this.checkPasswords(base, confirm)) {
                this.setError({message : this.getErrorMessage(ERROR_UNCONFIRMED)});
                return false;
            }
            return true;
        }
        if(!this.dom.find(".field-item > input").val()) {
            this.setError({message : this.getErrorMessage(Field.ERROR_EMPTY)});
        }
        return true;
    }

    /**
     * @param {jQuery|HTMLElement} baseElem
     * @param {jQuery|HTMLElement} confirmElem
     * @return {boolean}
     */
    checkPasswords(baseElem, confirmElem) {
        let
            baseValue = baseElem.val(),
            confirmValue = confirmElem.val(),
            confirmParent = confirmElem.parent()
        ;
        if(baseValue) {
            confirmParent.removeClass("active error");
           if(baseValue !== confirmValue) {
                confirmParent.addClass("error");
                return false;
           } else {
                confirmParent.addClass("active");
           }
        }
        return true;
    }

    /**
     * @param {Event} e
     */
    eyeOnClick(e) {
        let
            elem = $(e.currentTarget),
            input = elem.prev(),
            name = input.attr("name")
        ;
        if(name && name.match(/confirm/i)) {
            this.run(EVENT_CONFIRM_EYE_CLICK, e, this);
        } else {
            this.run(EVENT_EYE_CLICK, e, this);
        }
        return this.toggleShowValue(input, elem);
    }

    /**
     * @param {jQuery|HTMLElement} input
     * @param {jQuery|HTMLElement} eye
     * @param {boolean} forceHidden
     * @return {boolean}
     */
    toggleShowValue(input, eye, forceHidden = false) {
        if(input.attr("type") === "password" && !forceHidden) {
            input.attr("type", "text");
            eye.find("i")
                .removeClass("fa-eye")
                .addClass("fa-eye-slash")
            ;
        } else {
            input.attr("type", "password");
            eye.find("i")
                .removeClass("fa-eye-slash")
                .addClass("fa-eye")
            ;
        }
        return true;
    }

    /**
     * @param {number} count
     * @param {string} value
     */
    getClassSquare(count, value) {
        if(count <= 1) {
            return PASSWORD_CONTROL_DANGER;
        } else if(count <= VALIDATION_MIN_COUNT || value.length < PASSWORD_MIN_LENGTH) {
            return PASSWORD_CONTROL_WARNING;
        }
        return PASSWORD_CONTROL_SUCCESS;
    }

    setEvents() {
        super.setEvents();

        let
            this_o = this,
            baseInput = this.dom.find(".field-item > input"),
            eye = this.dom.find(".field-eye")
        ;

        eye.on("click", function (e) {
            return this_o.eyeOnClick(e);
        });

        baseInput.on("copy", function (e) {
            return this_o.disableCopyOrPaste(e);
        });

        if(this.isToConfirm()) {
            let
                generateAndCopyButton = this.dom.find(".password-generated-button"),
                confirmInput = this.dom.find(".field-confirm > input")
            ;

            baseInput.on("paste", function (e) {
                return this_o.disableCopyOrPaste(e);
            });

            baseInput.on("change", function (e) {
                this_o.fieldOnKeyUp(e);
            });

            confirmInput.on("change", function (e) {
                this_o.confirmOnKeyUp(e);
            });

            baseInput.on("keyup", function (e) {
                this_o.fieldOnKeyUp(e);
            });

            confirmInput.on("keyup", function (e) {
                this_o.confirmOnKeyUp(e);
            });

            confirmInput.on("focusin", function (e) {
                return this_o.confirmOnFocusIn(e);
            });

            confirmInput.on("focusout", function (e) {
                return this_o.confirmOnFocusOut(e);
            });

            confirmInput.on("paste", function (e) {
                return this_o.disableCopyOrPaste(e);
            });

            confirmInput.on("copy", function (e) {
                return this_o.disableCopyOrPaste(e);
            });

            generateAndCopyButton.on("click", (e) => {
                return this_o.generatePassword(e);
            });
        }
    }

    setError(error) {
        super.setError(error);
        if(this.isToConfirm()) {
            this.dom.find(".field-confirm").addClass("error");
        }
    }

    removeError() {
        super.removeError();
        if(this.isToConfirm()) {
            this.dom.find(".field-confirm").removeClass("error");
        }
    }

    disabled() {
        if(super.disabled()) {
            this.dom.find(".field-confirm").append(Field.DISABLED_DOM);
        }
        return true;
    }

}

module.exports = PasswordField;