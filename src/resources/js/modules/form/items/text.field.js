const Translator = require("./translator.field");
const TextDatalist = require("./text/text.datalist");

const ERROR_PATTERN_INVALID = "form.pattern.invalid";
const ERROR_DATALIST_ALREADY_EXIST = "form.datalist.already.exist";

/**
 * @property {Form} form
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
 * @property {{}} errorMessages
 * @property {boolean} ________disable________
 * @property {boolean} translator
 * @property {number} lastPosition
 * @property {jQuery|HTMLElement} langContainer
 * @property {RegExp|undefined} pattern
 * @property {string[]|Array|TextDatalist|undefined} dataList
 * @property {number|undefined} dataListControl
 */
class TextField extends Translator {


    static ERROR_PATTERN_INVALID = ERROR_PATTERN_INVALID;
    static ERROR_DATALIST_ALREADY_EXIST = ERROR_DATALIST_ALREADY_EXIST;


    /**
     * @param {Form} form
     * @param {jQuery|HTMLElement} dom
     */
    constructor(form, dom) {
        super(form, dom);
        this.pattern = RegExp.buildFromString(this.pattern);
        this.dataList = TextDatalist.init(this.dataList, this.dataListControl, this);
        //co.log(this);
    }

    setValue(value) {
        this.dom.find("input").val(value);
        this.checkValue();
    }

    /**
     * @return {boolean}
     */
    checkValue() {
        return this.checkPatternOrDataList() && super.checkValue();
    }

    /**
     * @return {boolean}
     */
    checkPatternOrDataList() {
        if(this.pattern || this.dataList) {
            let
                input = this.dom.find("input"),
                value = input.val(),
                errors = []
            ;
            this.removeError();
            this.active();
            if(this.dataList && this.dataList.match(value)) {
                if(this.dataList.isRequireErrorOutputted()) {
                    errors.push(this.getErrorMessage(TextField.ERROR_DATALIST_ALREADY_EXIST));
                }
            }
            if(value) {
                if(this.pattern && !(!!value.match(this.pattern))) {
                    errors.push(this.getErrorMessage(TextField.ERROR_PATTERN_INVALID));
                }
            }
            if(errors.length) this.setError({message:errors});
            return (errors.length === 0);
        }
        return true;
    }

    fieldOnFocusIn(e) {
        super.fieldOnFocusIn(e);
        if(this.dataList && this.dataList.isChoiceControl()) {
            this.dataList.showIfItemsAreVisible();
        }
    }

    fieldOnFocusOut(e) {
        super.fieldOnFocusOut(e);
        if(this.dataList && this.dataList.isChoiceControl()) {
            this.dataList.hide();
        }
    }

    setEvents() {
        super.setEvents();
        if(!this.useTranslator()) {
            if(this.pattern || this.dataList) {
                this.dom.find("input").on("keyup", this.checkPatternOrDataList.bind(this));
            }
        }
    }


}

module.exports = TextField;