const Field = require("./field");
const SelectOption = require("./select/option");

const OPTIONS_HEIGHT = 251;


const EVENT_CLOSE_OPTIONS = "close.options";

const EVENTS = [
    EVENT_CLOSE_OPTIONS
];

/**
 * @property {SelectOption[]} options
 * @property {boolean} multiple
 * @property {boolean} search
 */
class SelectField extends Field {

    static NAME = "select";

    /**
     * @param {Form} form
     * @param {jQuery|HTMLElement} dom
     */
    constructor(form, dom) {
        super(form, dom);
        this.options = [];
        this.setOptions();
        if(!this.isMultiple()) {
            this.addAcceptedEvents(EVENTS);
        }
        // co.log(this);
    }

    /**
     * @return {boolean}
     */
    isMultiple() {
        return this.multiple;
    }

    /**
     * @return {boolean}
     */
    isSearchable() {
        return this.search;
    }

    setOptions() {
        let
            this_o = this,
            options = this.dom.find("option"),
            superOptions = this.dom.find(".super-option")
        ;
        $.each(superOptions, (k, option) => {
            this_o.options.push(new SelectOption(this_o, option, options[k]));
        });
    }

    /**
     * @return {SelectOption[]}
     */
    getOptions() {
        return this.options;
    }

    /**
     * @param {Event} e
     */
    superSelectedOnClick(e) {
        let
            options = this.dom.find(".super-options"),
            arrow = this.dom.find(".super-arrow")
        ;
        if(options.hasClass("super-options-open")) {
            this.closeOptions(options, arrow);
        } else {
            this.openOptions(options, arrow);
        }
    }

    /**
     * @param {jQuery|HTMLElement|undefined} options
     * @param {jQuery|HTMLElement|undefined} arrow
     */
    openOptions(options = undefined, arrow = undefined) {
        options = options || this.dom.find(".super-options");
        arrow = arrow || this.dom.find(".super-arrow");
        if(!this.dom.hasClass("active") && !this.dom.hasClass("error")) {
            this.dom.hasClass("active");
        }
        this.dom.find(".super-input").removeAttr("disabled", "disabled");
        arrow.addClass("super-arrow-open");
        options.addClass("super-options-open");
        this.dom.addClass("focus");
    }

    /**
     * @param {jQuery|HTMLElement|undefined} options
     * @param {jQuery|HTMLElement|undefined} arrow
     */
    closeOptions(options = undefined, arrow = undefined) {
        let
            this_o = this
        ;
        options = options || this.dom.find(".super-options");
        arrow = arrow || this.dom.find(".super-arrow");
        if(this.dom.hasClass("active") && !this.dom.find("select").val()) {
            this.dom.removeClass("active");
        }
        arrow.removeClass("super-arrow-open");
        options.removeClass("super-options-open");
        this.dom.removeClass("focus");
        setTimeout(() => {
            this_o.dom.find(".super-input").val("");
            this_o.dom.find(".super-input").attr("disabled", "disabled");
            this_o.dom.find(".super-options").scrollTop(0);
            this_o.dom.find(".search-icon > i")
                .removeClass("fa-close")
                .addClass("fa-search")
            ;
            this_o.getOptions().forEach((option) => {
                option.resetText();
                option.show();
            });
        }, 100);
    }

    /**
     * @param {Event} e
     */
    inputOnKeyUp(e) {
        let
            this_o = this,
            elem = $(e.currentTarget),
            value = elem.val(),
            searchIcon = this.dom.find(".search-icon > i")
        ;
        if(value) {
            searchIcon
                .removeClass("fa-search")
                .addClass("fa-close")
            ;
        } else {
            searchIcon
                .removeClass("fa-close")
                .addClass("fa-search")
            ;
        }

        this.getOptions().forEach((option) => {
            option.resetText();
            if(value) {
                let
                    vSplit = value.split(" "),
                    /**
                     * @type {RegExp[]}
                     */
                    regexps
                ;
                if(vSplit.length > 1) {
                    regexps = [];
                    vSplit.forEach((_value) => {
                        if(_value) {
                            regexps.push(new RegExp(_value, "gi"));
                        }
                    });
                    this_o.rewriteText(option, regexps);
                } else {
                    this_o.rewriteText(option, [new RegExp(value, "gi")]);
                }
            } else {
                option.show();
            }
        });
    }

    /**
     * @param {SelectOption} option
     * @param {RegExp[]} regexps
     */
    rewriteText(option, regexps) {
        if(co.isArray(regexps) && regexps.length) {
            option.changeText(regexps);
            if(option.isChanged()) {
                option.show();
                return true;
            }
        }
        option.hide();
        return false;
    }

    /**
     * @param {Event} e
     */
    inputOnFocusin(e) {
        this.dom.parent().find(".field-container.focus").removeClass("focus");
        if(!this.dom.hasClass("active")) {
            this.dom.addClass("active");
        }
        this.dom.addClass("focus");
    }

    /**
     * @param {Event} e
     */
    inputOnFocusout(e) {
        if(this.dom.hasClass("active")) {
            let
                removeActive
            ;
            if(this.isMultiple()) {
                removeActive = (co.under(this.dom.find("select").val().length, 1));
            } else {
                removeActive = (co.under(this.dom.find("select").find("> option:selected").length, 1));
            }
            if(removeActive) {
                this.dom.removeClass("active");
            }
        }
        if(!this.isMultiple()) {
            // Pas sur de vouloir fermer le select après le focus out
            // let this_o = this;
            // setTimeout(() => {
            //     this_o.closeOptions();
            // }, 300);
        }
        this.dom.removeClass("focus");
    }

    /**
     * @param {Event} e
     */
    searchRemoveOnClick(e) {
        this.emptySelected();
    }

    /**
     * @param {Event} e
     */
    searchIconOnClick(e) {
        let
            elem = $(e.currentTarget)
        ;

        if(elem.find(".fa-close").length) {
            elem
                .find("> i")
                .removeClass("fa-close")
                .addClass("fa-search")
            ;
            this.dom.find(".super-input").val("");
            this.getOptions().forEach((option) => {
                option.resetText();
                option.show();
            });
        }
        this.dom.find(".super-input").focus();
    }

    emptySelected() {
        this.dom.find("select").val("");
        this.dom.find(".super-selected").html("");
        this.dom.find(".super-remove").removeClass("super-remove-show");
        if(this.dom.hasClass("active")) {
            this.dom.removeClass("active");
        }
    }

    /**
     * @return {boolean}
     */
    checkValue() {
        if(this.isMultiple()) {
            if(!co.greater(this.dom.find("select").val().length, 0)) {
                this.setError({message : this.getErrorMessage(Field.ERROR_EMPTY)});
                return false;
            }
        } else {
            if(!co.greater(this.dom.find("select > option:selected").length, 0)) {
                this.setError({message : this.getErrorMessage(Field.ERROR_EMPTY)});
                return false;
            }
        }
        return true;
    }

    setEvents() {
        let
            this_o = this
        ;
        if(!this.isMultiple()) {
            this.dom.find("label, .super-selected, .super-arrow").on("click", (e) => {
                return this_o.superSelectedOnClick(e);
            });
        }

        this.dom.find(".search-icon").on("click", (e) => {
            return this_o.searchIconOnClick(e);
        });

        this.dom.find(".super-remove").on("click", (e) => {
            return this_o.searchRemoveOnClick(e);
        });

        if(this.isSearchable()) {
            this.dom.find(".super-input").on("keyup", (e) => {
                return this_o.inputOnKeyUp(e);
            });

            this.dom.find(".super-input").on("focusin", (e) => {
                return this_o.inputOnFocusin(e);
            });

            this.dom.find(".super-input").on("focusout", (e) => {
                return this_o.inputOnFocusout(e);
            });
        }

        this.getOptions().forEach((option) => {
            option.setEvents();
        });
    }

}

module.exports = SelectField;