const SPAN_FROM = "<span class='super-search-found'>";
const SPAN_FROM_HASH = "´´´´´´´´´´´´´´´´´´´´´´´´´´";
const SPAN_FROM_REGEXP = new RegExp(SPAN_FROM_HASH, "g");
const SPAN_TO = "</span>";
const SPAN_TO_HASH = "````````````````````````````";
const SPAN_TO_REGEXP = new RegExp(SPAN_TO_HASH, "g");

/**
 * @property {SelectField} select
 * @property {jQuery|HTMLElement} dom
 * @property {jQuery|HTMLElement} option
 * @property {string} title
 * @property {string} value
 * @property {boolean} empty
 * @property {boolean} selected
 */
class SelectOption {

    /**
     * @param {SelectField} select
     * @param {jQuery|HTMLElement} dom
     * @param {jQuery|HTMLElement} option
     */
    constructor(select, dom, option) {
        this.select = select;
        this.dom = $(dom);
        this.option = $(option);
        this.title = this.option.text();
        this.value = co.data(this.dom, "value") || this.option.attr("value");
        this.empty = !!co.data(this.dom, "empty");
        this.selected = co.data(this.dom, "selected");
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
            if(this.select.isMultiple()) {
                if(!this.select.dom.find("select").val().length && this.select.dom.addClass("active")) {
                    this.select.dom.removeClass("active");
                }
            }
        } else {
            this.dom.addClass("selected");
            this.option.prop("selected", true);
            if(!this.select.dom.hasClass("active") && !this.select.dom.hasClass("error")) {
                !this.select.dom.addClass("active");
            }
        }
    }

    /**
     * @param {Event} e
     */
    domOnClickSingle(e) {
        if(this.isEmpty()) {
            this.select.emptySelected();
        } else {
            if(!this.option.is(":selected")) {
                this.select.dom.find(".selected").removeClass("selected");
                this.select.dom.find(".super-remove").addClass("super-remove-show");
                this.select.dom.find(".super-selected").html(this.title);
                this.option.prop("selected", true);
                this.dom.addClass("selected");
                if(!this.select.dom.hasClass("active")) {
                    this.select.dom.addClass("active");
                }
            }
        }
        this.select.closeOptions();
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
        if(this.select.isMultiple()) {
            this.dom.on("click", this.domOnClickMultiple.bind(this));
        } else {
            this.dom.on("click", this.domOnClickSingle.bind(this));
        }
    }

}


module.exports = SelectOption;