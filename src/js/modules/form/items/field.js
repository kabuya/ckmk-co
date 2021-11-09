const EventTypes = require("../../events/listener/event.types");

const EVENT_VALIDATION = "validation";
const EVENT_ERROR = "error";
const EVENT_CHANGE = "change";
const EVENT_FOCUSIN = "focusin";
const EVENT_FOCUSOUT = "focusout";
const EVENTS = [
    EVENT_VALIDATION,
    EVENT_ERROR,
    EVENT_CHANGE,
    EVENT_FOCUSIN,
    EVENT_FOCUSOUT,
];

const FORM_EVENT_BEFORE_SUBMIT = "before.submit";
const FORM_EVENT_AFTER_SUBMIT = "after.submit";
const FORM_EVENT_DISABLED = "disabled";
const FORM_EVENT_ENABLED = "enabled";

const FORM_EVENTS = [
    FORM_EVENT_BEFORE_SUBMIT,
    FORM_EVENT_AFTER_SUBMIT,
    FORM_EVENT_DISABLED,
    FORM_EVENT_ENABLED
];

const ERROR_EMPTY = "form.empty";
const ERROR_SIZE_VALUE = "form.size.value";

const ERRORS = [
    ERROR_EMPTY,
    ERROR_SIZE_VALUE
];

const DISABLED_DOM = ["<div class='field-disabled'></div>"].join("");

/**
 * @property {Form} Form
 * @property {jQuery|HTMLElement} dom
 * @property {string} label
 * @property {string} type
 * @property {string} targetType
 * @property {string} name
 * @property {string} nameID
 * @property {jQuery|HTMLElement|undefined} tab
 * @property {number|string} max
 * @property {number|string} min
 * @property {boolean} required
 * @property {boolean} unique
 * @property {boolean} __disable
 * @property {{}} errorMessages
 */
class Field extends EventTypes {

    static NAME = "text";

    static DISABLED_DOM = DISABLED_DOM;
    static EVENT_VALIDATION = EVENT_VALIDATION;
    static EVENT_ERROR = EVENT_ERROR;
    static EVENT_CHANGE = EVENT_CHANGE;
    static EVENT_FOCUSIN = EVENT_FOCUSIN;
    static EVENT_FOCUSOUT = EVENT_FOCUSOUT;
    static EVENTS = EVENTS;

    static FORM_EVENT_BEFORE_SUBMIT = FORM_EVENT_BEFORE_SUBMIT;
    static FORM_EVENT_AFTER_SUBMIT = FORM_EVENT_AFTER_SUBMIT;
    static FORM_EVENT_DISABLED = FORM_EVENT_DISABLED;
    static FORM_EVENT_ENABLED = FORM_EVENT_ENABLED;

    static FORM_EVENTS = FORM_EVENTS;

    static ERROR_EMPTY = ERROR_EMPTY;
    static ERROR_SIZE_VALUE = ERROR_SIZE_VALUE;

    static ERRORS = ERRORS;

    /**
     * @param {Form} form
     * @param {jQuery|HTMLElement} dom
     */
    constructor(form, dom) {
        super();
        let
            this_o = this
        ;
        this.form = form;
        this.dom = $(dom);
        /** @type {string} */
        this.label = this.dom.find(".field-item > label").attr("title");
        form.setProperties(this, this.dom.data());
        this.nameID = this.name.match(/\[[a-z0-9\-\_]+\]/i);
        if(this.nameID) {
            /** @type {string} */
            this.nameID = this.nameID[0].replace(/[\[\]]+/g, "");
        }
        if(this.tab) {
            this.tab = form.dom.find("#" + this.tab);
        }
        this.addAcceptedEvents(EVENTS);
        if(this.__disable) this.disabled();
        // co.log(this);
    }

    /**
     * @param {Event} e
     * @param {Form} form
     */
    onBeforeSubmit(e, form) {

    }

    /**
     * @param {Event} e
     * @param {Form} form
     */
    onAfterSubmit(e, form) {

    }

    /**
     * @return {Form}
     */
    getForm() {
        return this.form;
    }

    /**
     * @return {string}
     */
    getLabel() {
        return this.label;
    }

    /**
     * @return {string}
     */
    getName() {
        return this.name;
    }

    /**
     * @return {boolean}
     */
    useMax () {
        return !!(co.isInt(this.min, this.max) && co.under(this.min, this.max) && co.greater(this.max, 0));
    }

    /**
     * @return {number}
     */
    getMax() {
        return this.max;
    }

    /**
     * @return {number}
     */
    getMin() {
        return this.min;
    }

    /**
     * @return {string|undefined}
     */
    getType() {
        return this.type;
    }

    /**
     * @return {string|undefined}
     */
    getTargetType() {
        return this.targetType;
    }

    /**
     * @return {boolean}
     */
    isRequired() {
        return this.required;
    }

    /**
     * @return {boolean}
     */
    isUnique() {
        return this.unique;
    }

    /**
     * @return {boolean}
     */
    isValid() {
        if(this.isRequired()) {
            if(!this.checkValue()) return false;
            if(!this.dom.hasClass("active")) {
                this.dom.addClass("active");
            }
        }
        return true;
    }

    /**
     * @return {boolean}
     */
    checkValue() {
        if(this.isTypeHidden()) return true;
        let
            field = this.dom.find(".field-item").find("input, textarea, select"),
            value = field.length ? field.val() : undefined
        ;
        if(value) {
            value = "" + value;
            if(!value.match(/^[ ]*$/)) {
                if(!this.checkLengthValue(value)) {
                    this.setError({message : this.getErrorMessage(ERROR_SIZE_VALUE, value, this.min, this.max)});
                    return false;
                }
                return true;
            }
        }
        this.setError({message : this.getErrorMessage(ERROR_EMPTY)});
        return false;
    }

    /**
     * @param {string|number} value
     * @return {boolean}
     */
    checkLengthValue(value) {
        if((co.isInt(this.min, this.max) || co.isString(this.min, this.max)) && co.greater(this.max, this.min)) {
            if(co.isInt(this.min, this.max)) {
                if(value.match(/^[0-9]+((,|.)[0-9]+)?$/)) {
                   value = value.replace(",", ".");
                } else  {
                    value = value.length;
                }
                return co.between(value, this.min, this.max);
            }
            return co.between(value, this.min, this.max);
        }
        return true;
    }

    /**
     * @param {any} args
     * @return {undefined}
     */
    runValidationEvent(...args) {
        return this.run(EVENT_VALIDATION, ...args);
    }

    /**
     * @param {any} args
     * @return {undefined}
     */
    runErrorEvent(...args) {
        return this.run(EVENT_ERROR, ...args);
    }

    /**
     * @param {any} args
     * @return {undefined}
     */
    runChangeEvent(...args) {
        return this.run(EVENT_CHANGE, ...args);
    }

    /**
     * @param {any} args
     * @return {undefined}
     */
    runFocusinEvent(...args) {
        return this.run(EVENT_FOCUSIN, ...args);
    }

    /**
     * @param {any} args
     * @return {undefined}
     */
    runFocusoutEvent(...args) {
        return this.run(EVENT_FOCUSOUT, ...args);
    }

    /**
     * @param {Event} e
     */
    fieldOnChange(e) {
        this.runChangeEvent(e, this);
        if(!this.dom.hasClass("error")) {
            let
                elem = $(e.currentTarget)
            ;
            if(elem.val() && !this.dom.hasClass("active")) {
                this.dom.addClass("active");
            } else if(!elem.val() && this.dom.hasClass("active")) {
                this.dom.removeClass("active");
                this.dom.removeClass("focus");
            }
        }
    }

    /**
     * @param {Event} e
     */
    fieldOnFocusIn(e) {
        this.runFocusinEvent(e, this);
        this.form.dom.find(".field-container").removeClass("focus");
        if(!this.dom.hasClass("active") && !this.dom.hasClass("error")) {
            this.dom.addClass("active");
        }
        this.dom.addClass("focus");
    }

    /**
     * @param {Event} e
     */
    fieldOnFocusOut(e) {
        this.runFocusoutEvent(e, this);
        let
            elem = $(e.currentTarget)
        ;
        if(!elem.val() && !this.dom.hasClass("error")) {
            this.dom.removeClass("active");
        }
        this.dom.removeClass("focus");
    }

    /**
     * @param {{message:(string|string[])}} error
     */
    setError(error) {
        if(co.isString(error.message) || co.isArray(error.message)) {
            if(this.tab && !this.tab.hasClass("form-tab-error")) {
                if(!this.form.errorTabShow) {
                    this.form.errorTabShow = this.tab;
                    this.tab.click();
                }
                this.tab.addClass("form-tab-error");
            }
            let
                errorDom = this.dom.find(".field-error")
            ;
            this.dom.removeClass("active");
            this.dom.addClass("error");
            if(co.isString(error.message)) error.message = [error.message];
            errorDom.html("");
            error.message.forEach((_msg) => {
                if(co.isString(_msg)) errorDom.append(this.form.setErrorDom(_msg));
            });
        }
    }

    /**
     * @return {boolean}
     */
    hasError() {
        return (
            this.dom.hasClass("error")
            ||
            this.dom.find(".field-error").text().trim() !== ""
        );
    }

    removeError() {
        if(!this.hasError()) return false;
        this.dom.removeClass("error");
        this.dom.find(".field-error").html("");
        return true;
    }

    /**
     * @param {string} name
     * @param args
     * @return {string|undefined}
     */
    getErrorMessage(name, ...args) {
        let msg = this.errorMessages[name];
        if(co.isString(msg)) {
            return msg.replaceVar(...args);
        }
    }

    /**
     * @return {boolean}
     */
    disabled() {
        if(this.isDisable() && this.__disable) return false;
        this.dom.find(".field-item").prepend(DISABLED_DOM);
        this.dom.addClass("field-un-editable field-fixed-content field-no-editable");
        return true;
    }

    /**
     * @return {boolean}
     */
    enabled() {
        if(!this.isDisable() || this.__disable) return false;
        this.dom.find(".field-disabled").remove();
        this.dom.removeClass("field-un-editable field-fixed-content field-no-editable");
        return true;
    }

    /**
     * @return {boolean}
     */
    isDisable() {
        return (this.dom.find(".field-disabled").length > 0);
    }

    /**
     * @return {boolean}
     */
    isTypeHidden() {
        return this.type === "hidden";
    }

    setEvents() {
        let
            this_o = this,
            fieldHtml = this.dom.find(".field-item").find("input, textarea, select")
        ;

        fieldHtml.on("change", function (e) {
            return this_o.fieldOnChange(e);
        });

        fieldHtml.on("focusin", function (e) {
            return this_o.fieldOnFocusIn(e);
        });

        fieldHtml.on("focusout", function (e) {
            return this_o.fieldOnFocusOut(e);
        });

        this.form.on(FORM_EVENT_BEFORE_SUBMIT, [this, "onBeforeSubmit"]);
        this.form.on(FORM_EVENT_AFTER_SUBMIT, [this, "onAfterSubmit"]);
        this.setToggleAbleEvents();
    }

    setToggleAbleEvents() {
        this.form.on(FORM_EVENT_DISABLED, [this, "disabled"]);
        this.form.on(FORM_EVENT_ENABLED, [this, "enabled"]);
    }

    /**
     * @param {string} types
     * @return {boolean}
     */
    static isSameType(...types) {
        return this.NAME.in(...types);
    }

}

module.exports = Field;