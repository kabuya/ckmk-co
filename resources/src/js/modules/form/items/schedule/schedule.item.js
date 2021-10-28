const TYPE_FROM = "from";
const TYPE_TO = "to";

/**
 * @property {ScheduleField} ScheduleField
 * @property {jQuery|HTMLElement} dom
 * @property {string} title
 * @property {boolean} focus
 * @property {{from:boolean,to:boolean}} changed
 */
class ScheduleItem {

    /**
     * @param {ScheduleField} ScheduleField
     * @param {jQuery|HTMLElement} dom
     */
    constructor(ScheduleField, dom) {
        this.ScheduleField = ScheduleField;
        this.dom = $(dom);
        this.changed = {from:false,to:false};
        this.title = this.dom.find(".schedule-day").attr("title");
        this.focus = false;
        this.setEvents();
        // co.log(this);
    }

    /**
     * @return {boolean}
     */
    isFocused() {
        return this.focus;
    }

    /**
     * @param {Event} e
     */
    labelOnClick(e) {
        this.dom.find(".schedule-from > input").focus();
    }

    /**
     * @param {Event} e
     */
    fromLabelOnClick(e) {
        this.dom.find(".schedule-from > input").focus();
    }

    /**
     * @param {Event} e
     */
    toLabelOnClick(e) {
        this.dom.find(".schedule-to > input").focus();
    }

    /**
     * @param {Event} e
     */
    inputOnFocusin(e) {
        if(!this.dom.hasClass("error") && !this.dom.hasClass("active")) {
            this.ScheduleField.dom.addClass("active");
            this.dom.addClass("active");
        }
        this.focus = true;
        this.ScheduleField.dom.addClass("focus");
    }

    /**
     * @param {Event} e
     */
    inputOnFocusout(e) {
        if(!this.dom.hasClass("error") && this.dom.hasClass("active") && !this.hasValue()) {
            this.dom.removeClass("active");
        }
        if(!this.ScheduleField.hasValues()) {
            this.ScheduleField.dom.removeClass("active");
        }
        this.focus = false;
        if(!this.ScheduleField.hasFocusedItem()) {
            this.ScheduleField.dom.removeClass("focus");
        }
    }

    setError() {
        this.dom.removeClass("active");
        this.dom.addClass("error");
    }

    removeError() {
        this.dom.removeClass("error");
        if(this.hasValue()) {
            this.dom.addClass("active");
        }
    }

    /**
     * @param {Event} e
     * @param {string} type
     */
    inputOnChange(e, type) {
        if(type === TYPE_FROM) {
            if(!this.changed.from) {
                this.changed.from = true;
            }
        } else if(type === TYPE_TO) {
            if(!this.changed.to) {
                this.changed.to = true;
            }
        }
    }

    /**
     * @return {boolean}
     */
    hasValue() {
        let
            fromValue = this.dom.find(".schedule-from > input").val(),
            toValue = this.dom.find(".schedule-to > input").val()
        ;
        if(fromValue.match(/^00:00(:00)?$/) && toValue.match(/^00:00(:00)?$/)) {
            if(this.changed.from) {
                this.changed.from = false;
            }
            if(this.changed.to) {
                this.changed.to = false;
            }
        }
        return (this.changed.from || this.changed.to);
    }

    /**
     * @return {boolean}
     */
    isValid() {
        if(this.hasValue()) {
            let
                fromValue = this.dom.find(".schedule-from > input").val(),
                toValue = this.dom.find(".schedule-to > input").val()
            ;
            return (fromValue < toValue);
        }
        return true;
    }

    setEvents() {
        let
            this_o = this,
            label = this.dom.find(".schedule-day"),
            fromLabel = this.dom.find(".schedule-from > div"),
            fromInput = this.dom.find(".schedule-from > input"),
            toLabel = this.dom.find(".schedule-to > div"),
            toInput = this.dom.find(".schedule-to > input")
        ;
        label.on("click", (e) => {
            this_o.labelOnClick(e);
        });
        fromLabel.on("click", (e) => {
            this_o.fromLabelOnClick(e);
        });
        toLabel.on("click", (e) => {
            this_o.toLabelOnClick(e);
        });
        fromInput.on("focusin", (e) => {
            this_o.inputOnFocusin(e);
        });
        toInput.on("focusin", (e) => {
            this_o.inputOnFocusin(e);
        });
        fromInput.on("focusout", (e) => {
            this_o.inputOnFocusout(e);
        });
        toInput.on("focusout", (e) => {
            this_o.inputOnFocusout(e);
        });
        fromInput.on("change", (e) => {
            this_o.inputOnChange(e, TYPE_FROM);
        });
        toInput.on("change", (e) => {
            this_o.inputOnChange(e, TYPE_TO);
        });
    }

}

module.exports = ScheduleItem;