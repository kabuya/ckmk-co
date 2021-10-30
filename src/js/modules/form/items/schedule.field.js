const Field = require("./field");
const ScheduleItem = require("./schedule/schedule.item");

const ERROR_INVALID = "form.schedule.invalid";
const ERROR_ITEM_SUCCESS_COUNT = "form.schedule.item.success.count";

const ERRORS = [
    ERROR_INVALID,
    ERROR_ITEM_SUCCESS_COUNT
];

/**
 * @property {ScheduleItem[]} items
 * @property {Date} date
 */
class ScheduleField extends Field {

    static NAME = "schedule";

    /**
     * @param {Form} form
     * @param {jQuery|HTMLElement} dom
     */
    constructor(form, dom) {
        super(form, dom);
        let
            this_o = this
        ;
        delete this.max;
        this.items = [];
        this.date = new Date();
        $.each(this.dom.find(".field-schedule"), (k, schedule) => {
            this_o.items.push(new ScheduleItem(this, schedule));
        });
        // co.log(this);
    }

    setEvents() {

    }

    /**
     * @return {boolean}
     */
    hasValues() {
        let
            valueFound = false
        ;
        $.each(this.items, (k, item) => {
            if(item.hasValue() && !valueFound) {
                valueFound = true;
                return false;
            }
        });
        return valueFound;
    }

    /**
     * @return {boolean}
     */
    hasFocusedItem() {
        let
            success = false
        ;
        this.items.forEach((item) => {
            if(item.isFocused() && !success) {
                success = true;
                return false;
            }
        });
        return success;
    }

    checkValue() {
        let
            this_o = this,
            success = true,
            error = {status : false, message : []},
            successCount = 0
        ;
        this.items.forEach((item) => {
            if(!item.isValid()) {
                if(!error.status) {
                    error.status = true;
                    success = false;
                }
                error.message.push(this_o.getErrorMessage(ERROR_INVALID, item.title));
                item.setError();
            } else {
                if(item.hasValue()) {
                    successCount++;
                    item.removeError();
                }
            }
        });
        if(!co.greaterOrEqual(successCount, this.min) && this.isRequired()) {
            if(!error.status) {
                error.status = true;
                success = false;
            }
            error.message.push(this.getErrorMessage(ERROR_ITEM_SUCCESS_COUNT, this.min));
        }
        if(!success) {
            this.setError(error);
        }
        return success;
    }

}

module.exports = ScheduleField;