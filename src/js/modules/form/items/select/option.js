const SPAN_FROM = "<span class='super-search-found'>";
const SPAN_FROM_HASH = "´´´´´´´´´´´´´´´´´´´´´´´´´´";
const SPAN_FROM_REGEXP = new RegExp(SPAN_FROM_HASH, "g");
const SPAN_TO = "</span>";
const SPAN_TO_HASH = "````````````````````````````";
const SPAN_TO_REGEXP = new RegExp(SPAN_TO_HASH, "g");

/**
 * @property {SelectField} SelectField
 * @property {jQuery|HTMLElement} dom
 * @property {jQuery|HTMLElement} option
 * @property {string} title
 * @property {string} value
 * @property {boolean} empty
 * @property {boolean} selected
 */
class SelectOption {

    /**
     * @param {SelectField} SelectField
     * @param {jQuery|HTMLElement} dom
     * @param {jQuery|HTMLElement} option
     */
    constructor(SelectField, dom, option) {
        this.SelectField = SelectField;
        this.dom = $(dom);
        this.option = $(option);
        this.title = this.option.text();
        this.value = this.option.attr("value") || this.dom.data("value");
        this.empty = !!this.dom.data("empty");
        this.selected = this.dom.data("selected");
        this.dom
            .removeAttr("data-value")
            .removeAttr("data-selected")
        ;
    }

    /**
     * @return {boolean}
     */
    isSelected() {
        return this.selected;
    }

    /**
     * @return {string}
     */
    getTitle() {
        return this.title;
    }

    /**
     * @return {*|boolean}
     */
    isEmpty() {
        return this.empty;
    }

    /**
     * @param {Event} e
     */
    domOnClickMultiple(e) {
        if(this.option.is(":selected")) {
            this.dom.removeClass("selected");
            this.option.prop("selected", false);
            if(this.SelectField.isMultiple()) {
                if(!this.SelectField.dom.find("select").val().length && this.SelectField.dom.addClass("active")) {
                    this.SelectField.dom.removeClass("active");
                }
            }
        } else {
            this.dom.addClass("selected");
            this.option.prop("selected", true);
            if(!this.SelectField.dom.hasClass("active") && !this.SelectField.dom.hasClass("error")) {
                !this.SelectField.dom.addClass("active");
            }
        }
    }

    /**
     * @param {Event} e
     */
    domOnClickSingle(e) {
        if(this.isEmpty()) {
            this.SelectField.emptySelected();
        } else {
            if(!this.option.is(":selected")) {
                this.SelectField.dom.find(".super-remove").addClass("super-remove-show");
                this.option.prop("selected", true);
                this.SelectField.dom.find(".super-selected").html(this.title);
                if(!this.SelectField.dom.hasClass("active")) {
                    this.SelectField.dom.addClass("active");
                }
            }
        }
        this.SelectField.closeOptions();
    }

    /**
     * @param {RegExp[]} regexps
     */
    changeText(regexps) {
        let
            this_o = this,
            title
        ;
        regexps.forEach((regexp) => {
            let
                matched = this_o.title.match(regexp)
            ;
            if(matched) {
                $.each(matched, (k, value) => {
                    let
                        mRegexp = new RegExp(value, "g")
                    ;
                    if(!title) {
                        title = this_o.title.replace(mRegexp, SPAN_FROM_HASH + value + SPAN_TO_HASH);
                    } else {
                        title = title.replace(mRegexp, SPAN_FROM_HASH + value + SPAN_TO_HASH);
                    }
                });
            }
        });
        if(title) {
            let
                refactorContent = $("<div></div>"),
                spanParents
            ;
            refactorContent.html(title.replace(SPAN_FROM_REGEXP, SPAN_FROM).replace(SPAN_TO_REGEXP, SPAN_TO));
            spanParents = refactorContent.find("> span.super-search-found");
            if(spanParents.length) {
                $.each(spanParents, (k, spanParent) => {
                    spanParent = $(spanParent);
                    if(spanParent.find("> span").length) {
                        spanParent.html(spanParent.text());
                    }
                });
            }
            this.dom.html(refactorContent.html());
        }
    }

    /**
     * @return {boolean}
     */
    isChanged() {
        return (this.title !== this.dom.html());
    }

    resetText() {
        this.dom.html(this.title);
    }

    /**
     * @return {boolean}
     */
    show() {
        if(this.dom.hasClass("hidden")) {
            this.dom.removeClass("hidden");
        }
        return true;
    }

    /**
     * @return {boolean}
     */
    hide() {
        if(!this.dom.hasClass("hidden") && !this.dom.find(".super-search-found").length) {
            this.dom.addClass("hidden");
        }
        return true;
    }

    setEvents() {
        let
            this_o = this
        ;
        if(this.SelectField.isMultiple()) {
            this.dom.on("click", (e) => {
                return this_o.domOnClickMultiple(e);
            });
        } else {
            this.dom.on("click", (e) => {
                return this_o.domOnClickSingle(e);
            });
        }
    }

}


module.exports = SelectOption;