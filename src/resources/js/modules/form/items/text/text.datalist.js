const TextDatalistItem = require("./datalist/text.datalist.item");

const HTML_CLASS_VISIBLE_INCLUDE = "field-data-list-include";
const HTML_CLASS_VISIBLE_SHOW = "field-data-list-show";

const DATALIST_CONTROL_CHOICE = 256;
const DATALIST_CONTROL_ALREADY_EXIST = -256;

/**
 * @property {TextField} field
 * @property {number} dataControl
 * @property {jQuery|HTMLElement} dom
 * @property {TextDatalistItem[]} items
 */
class TextDatalist {

    static DATALIST_CONTROL_CHOICE = DATALIST_CONTROL_CHOICE;
    static DATALIST_CONTROL_ALREADY_EXIST = DATALIST_CONTROL_ALREADY_EXIST;

    /**
     * @param {string[]|Array} data
     * @param {number} dataControl
     * @param {TextField} field
     * @return {TextDatalist}
     */
    constructor(data, dataControl, field) {
        this.field = field;
        this.dataControl = dataControl;
        this.dom = field.dom.find(".field-data-list");
        /** @type {TextDatalistItem[]} */
        this.items = [];
        this.initItems(data);
    }

    /**
     * @return {boolean}
     */
    isVisible() {
        return this.dom.hasClass(HTML_CLASS_VISIBLE_INCLUDE) && this.dom.hasClass(HTML_CLASS_VISIBLE_SHOW);
    }

    /**
     * @return {boolean}
     */
    isUnVisible() {
        return !this.isVisible();
    }

    /**
     * @return {boolean}
     */
    itemsAreVisible() {
        return !!this.items.filter((_item) => {
            return _item.isVisible();
        }).length;
    }

    /**
     * @return {boolean}
     */
    show() {
        if(this.isVisible()) return false;
        let
            this_o = this
        ;
        co.timeOutChain(50,
            () => {
                this_o.dom.addClass(HTML_CLASS_VISIBLE_INCLUDE);
            },
            () => {
                this_o.dom.addClass(HTML_CLASS_VISIBLE_SHOW);
            }
        );
        return true;
    }

    /**
     * @return {boolean}
     */
    showIfItemsAreVisible() {
        if(this.itemsAreVisible()) {
            return this.show();
        }
        return false;
    }

    /**
     * @return {boolean}
     */
    hide() {
        if(this.isUnVisible()) return false;
        let
            this_o = this
        ;
        co.timeOutChain(300,
            () => {
                this_o.dom.removeClass(HTML_CLASS_VISIBLE_SHOW);
            },
            () => {
                this_o.dom.removeClass(HTML_CLASS_VISIBLE_INCLUDE);
            }
        );
        return true;
    }

    /**
     * @param {string} value
     * @return {boolean}
     */
    match(value) {
        let
            choiceControl = this.isChoiceControl(),
            matched = false
        ;
        if(co.isSet(value)) {
            this.items.forEach((_item) => {
                if(_item.match(value)) {
                    if(!matched) matched = true;
                }
            });
            if(choiceControl) {
                if(matched) {
                    this.show();
                } else {
                    this.hide();
                }
            }
        } else {
            if(choiceControl) {
                this.resetList();
                if(value === "") {
                    this.show();
                } else {
                    this.hide();
                }
            }
        }
        return matched;
    }

    setChoiceValue(value) {
        this.field.setValue(value);
    }

    resetList() {
        this.items.forEach((_item) => {
            _item.defaultHtml();
            _item.show();
        });
    }

    /**
     * @return {boolean}
     */
    isRequireErrorOutputted() {
        return this.isAlreadyExistControl();
    }

    /**
     * @return {boolean}
     */
    isChoiceControl() {
        return this.dataControl === DATALIST_CONTROL_CHOICE;
    }

    /**
     * @return {boolean}
     */
    isAlreadyExistControl() {
        return this.dataControl === DATALIST_CONTROL_ALREADY_EXIST;
    }

    initItems(data) {
        let
            this_o = this,
            doms = this.dom.find("div")
        ;
        Object.entries(data).forEach((_values, _k) => {
            let
                _key = _values[0],
                _value = _values[1],
                _dom = $(doms[_key])
            ;
            if(co.isString(_value) && _dom.length) {
                this_o.items.push(new TextDatalistItem(this_o, _value, _dom));
            }
        });
    }

    /**
     * @param {string[]|Array|undefined} data
     * @param {number} dataControl
     * @param {TextField} field
     * @return {TextDatalist}
     */
    static init(data, dataControl, field) {
        if(co.isArray(data)) {
            return new TextDatalist(data, dataControl, field);
        }
    }

}

module.exports = TextDatalist;