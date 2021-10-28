const Field = require("./field");
const SCROLL_DIRECTION = 35;

const ERROR_EMPTY_MULTIPLE = "form.empty.multiple";

const ERRORS = [
    ERROR_EMPTY_MULTIPLE,
];

/**
 * @property {boolean} translator
 * @property {number} lastPosition
 * @property {jQuery|HTMLElement} langContainer
 */
class TranslatorField extends Field {

    /**
     * @param {Form} form
     * @param {jQuery|HTMLElement} dom
     */
    constructor(form, dom) {
        super(form, dom);
        this.langContainer = this.dom.find(".lang-container");
        if(this.useTranslator()) {
            this.lastPosition = this.dom.find(".lang-list").children().last().position().left;
        }

        // co.log(this);
    }

    useTranslator() {
        return this.translator;
    }

    /**
     * @param {Event} e
     * @return {boolean}
     */
    labelOnClick(e) {
        let
            elem = $(e.currentTarget),
            inputContainer = $(".lang-input-content[data-id='"+ elem.attr("id") +"']"),
            input = $(inputContainer.children().get(1))
        ;
        this.dom.find(".lang-item").removeClass("active");
        this.dom.find(".lang-input-content").removeClass("active");
        elem.addClass("active");
        inputContainer.addClass("active");
        input.focus();
        this.moveLangContainer(elem.position().left -4, false);
        return true;
    }

    /**
     * @param {Event} e
     * @return {*}
     */
    arrowOnClick(e) {
        let
            elem = $(e.currentTarget),
            langActive = this.dom.find(".lang-item.active"),
            langNext
        ;
        if(elem.hasClass("lang-arrow-left")) {
            langNext = langActive.prev();
        } else {
            langNext = langActive.next();
        }
        if(!langNext.length) {
            return langActive.click();
        }
        return langNext.click();
    }

    /**
     * @param {number} position
     * @param {boolean} append
     */
    moveLangContainer(position, append = true) {
        if(this.isScrollable()) {
            if(append) {
                position += this.langContainer.scrollLeft();
            }
            this.langContainer.animate({
                scrollLeft : position,
            }, 300);
        }
    }

    /**
     * @return {boolean}
     */
    checkValue() {
        let
            this_o = this,
            success = true,
            fields = this.dom.find("input[type=text], textarea")
        ;
        $.each(fields, (k, elem) => {
            elem = $(elem);
            let
                hasValue = !!elem.val()
            ;
            if(!hasValue) {
                if(success) {
                    success = false;
                }
            }
            if(this_o.useTranslator()) {
                let
                    langItem = $(".lang-item[for='"+ elem.attr("id") +"']")
                ;
                if(hasValue) {
                    langItem.removeClass("error");
                } else {
                    langItem.addClass("error");
                }
            }
        });
        if(!success) {
            this.setError({message : ((fields.length > 1)
                ? this.getErrorMessage(ERROR_EMPTY_MULTIPLE)
                : this.getErrorMessage(Field.ERROR_EMPTY))
            })
        }
        return success;
    }

    isScrollable() {
        if(this.useTranslator()) {
            return this.langContainer.outerWidth() < this.lastPosition;
            // return this.langContainer.outerHeight() < this.lastPosition;
        }
        return false;
    }

    setEvents() {
        super.setEvents();
        if(this.useTranslator()) {
            let
                this_o = this
            ;
            this.dom.find(".lang-list > label").on("click", function (e) {
                return this_o.labelOnClick(e);
            });

            this.dom.find(".lang-arrow").on("click", function (e) {
                return this_o.arrowOnClick(e);
            });
        }
    }

    initErrorMessages() {
        super.initErrorMessages();

        if(!this.errorMessages[ERROR_EMPTY_MULTIPLE]) {
            this.errorMessages[ERROR_EMPTY_MULTIPLE] = "One or more fields are not completed.";
        }
    }

}

module.exports = TranslatorField;