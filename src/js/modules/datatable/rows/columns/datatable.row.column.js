const HASH_JOIN = "###########################################################";
const HTML_CLASS_HIDDEN = "datatable-item-hidden";

/**
 * @property {DatatableRow} row
 * @property {jQuery|HTMLElement} dom
 * @property {DatatableColumn} column
 * @property {number} position
 * @property {string|number} value
 * @property {string|number} rawValue
 * @property {string|number} compareValue
 * @property {
 *      DatatableColumnBooleanAction
 *      |DatatableColumnDateAction
 *      |DatatableColumnDatetimeAction
 *      |DatatableColumnEntityAction
 *      |DatatableColumnFloatAction
 *      |DatatableColumnImageAction
 *      |DatatableColumnIntegerAction
 *      |DatatableColumnLongtextAction
 *      |DatatableColumnTextAction
 *      |DatatableColumnTimeAction
 *      |DatatableColumnActionsAction
 *      |DatatableColumnAction
 * } action
 * @property {string|undefined} formTemplate
 */
class DatatableRowColumn {

    /**
     * @param {DatatableRow} row
     * @param {jQuery|HTMLElement} dom
     */
    constructor(row, dom) {
        this.row = row;
        this.dom = $(dom);
        /** @type {DatatableColumn} column */
        this.column = this.row.datatable.getColumn(co.data(this.dom, "column"));
        /** @type {number} position */
        this.position = co.data(this.dom, "position");
        /** @type {string|number} value */
        this.value = co.data(this.dom, "value");
        /** @type {string|number} rawValue */
        this.rawValue = co.data(this.dom, "raw-value");
        /** @type {string|number} compareValue */
        this.compareValue = co.data(this.dom, "compare-value");
        /** @type {string|undefined} formTemplate */
        this.formTemplate = this.getFormTemplate();
        if(this.column) {
            this.column.addColumn(this);
            this.action = this.column.type.getAction(this);
        }
        if(this.isHidden()) this.dom.remove();
    }

    /**
     * @param {string[]} values
     * @return {boolean}
     */
    match(values) {
        this.resetMatch();
        if(!values.length) return false;
        let
            vJoin = values
                .join(HASH_JOIN)
                .trim()
                .replace("|", "\\|")
                .replace(HASH_JOIN, "\|")
            ,
            rg = RegExp.searchBuild(vJoin, "gi"),
            _html = this.dom.html(),
            _text = this.column.type.isLongText()
                ? this.dom.text().trim().replace(/(\|)?[.]{3}(\|)?$/, "")
                : this.dom.text().trim()
            ,
            _matched = _text.match(rg),
            _textMatched
        ;
        if(_matched) {
            _textMatched = _text.replace(rg, (str) => {
                return [
                    "<span class='datatable-search-found'>",
                        str,
                    "</span>",
                ].join("");
            });
            this.dom.html(_html.replace(_text, _textMatched));
            return true;
        } else if(this.checkMatchFromCompareValue(rg)) {
            return true;
        }
        return false;
    }

    /**
     * @return {string}
     */
    getName() {
        return this.column.name;
    }

    /**
     * @param {RegExp} regexp
     * @return {boolean}
     */
    checkMatchFromCompareValue(regexp) {
        if(co.instanceOf(regexp, RegExp)) {
            if(co.isString(this.compareValue) && !co.isNumber(this.compareValue)) {
                return !!this.compareValue.match(regexp);
            }
        }
        return false;
    }

    resetMatch() {
        this.dom.html(this.value);
    }

    /**
     * @return {string|undefined}
     */
    getFormTemplate() {
        if(this.hasFormTemplate()) {
            let template = this.column.formTemplate
                .replace(
                    new RegExp(this.column.DEFAULT_VALUE_ID, "g"),
                    this.row.ID
                )
                .replace(
                    new RegExp(this.column.DEFAULT_VALUE_POSITION, "g"),
                    this.row.position.toString()
                )
                .replace(
                    new RegExp(this.column.DEFAULT_VALUE_VALUE, "g"),
                    (this.rawValue || "")
                )
                .replace(
                    new RegExp(this.column.getFormDefaultValue(), "g"),
                    (this.rawValue || "")
                )
            ;
            if(this.column.type.isEntity()) {
                let rg = this.column.type.getSelectedRegexp(this.rawValue);
                template = template.replace(rg, (str) => {
                    if(str.match(/selected/)) {
                        return str.replace("false", "true");
                    }
                    return co.concat(str, " ", "selected=\"selected\"");
                });
            }
            return template;
        }
    }

    /**
     * @return {boolean}
     */
    hasFormTemplate() {
        return (this.column && this.column.hasFormTemplate());
    }

    /**
     * @return {string}
     */
    getFormName() {
        return $("<div></div>")
            .css({display: "none"})
            .append(
                $("<input type='hidden' />")
                    .attr("name", "__form")
                    .attr("value", co.concat(
                        this.column.datatable.name,
                        "-",
                        this.column.name,
                        "-form"
                    ))
                    .prop("outerHTML")
            )
            .prop("outerHTML")
        ;
    }

    /**
     * @param {object} response
     * @param status
     * @param xhr
     */
    parseResponse(response, status, xhr) {
        if(response.messages) {
            let alert = this
                .column
                .datatable
                .alert
            ;
            if(response.success) {
                alert.success(response.messages);
            } else {
                alert.warning(response.messages);
            }
        }
        this.shareDataResponse(response);
    }

    /**
     * @param {object} dataResponse
     */
    shareDataResponse(dataResponse) {
        if(dataResponse[this.column.datatable.ROW_MODEL_KEY]) {
            let
                this_o = this,
                data = dataResponse[this.column.datatable.ROW_MODEL_KEY]
            ;
            this.updateValue(data[this.getName()]);
            $.each(data, (_name, _value) => {
                if(_name !== this_o.getName()) {
                    let _column = this_o.row.getColumn(_name);
                    if(_column) {
                        _column.updateValue(_value);
                    }
                }
            });
        }
    }

    /**
     * @param {string|number} value
     */
    updateValue(value) {
        if(co.isSet(value) && value !== this.rawValue) {
            let
                parseValue = this.column.type.checkValue(value)
            ;
            if(parseValue) {
                this.rawValue = value;
                this.value = parseValue;
                this.formTemplate = this.getFormTemplate();
                this.dom.html(this.value);
                if(this.column.type.isLongText()) {
                    this.action.updateShowMore();
                    this.action.setEventReadMore();
                }
            }
        }
    }

    /**
     * @return {boolean}
     */
    destroy() {
        if(this.action) this.action.destroy();
        this.dom.remove();
        return true;
    }

    show() {
        if(this.isVisible()) return false;
        this.dom.removeClass(HTML_CLASS_HIDDEN);
        return true;
    }

    hide() {
        if(!this.isVisible()) return false;
        this.dom.addClass(HTML_CLASS_HIDDEN);
        return true;
    }

    isVisible() {
        return !this.dom.hasClass(HTML_CLASS_HIDDEN);
    }

    /**
     * @return {boolean}
     */
    isOrdered() {
        return this.column.isOrdered();
    }

    /**
     * @return {boolean}
     */
    isHidden() {
        return this.column.isHidden();
    }

    /**
     * @return {boolean}
     */
    isSearchable() {
        return this.column.isSearchable();
    }

    /**
     * @return {boolean}
     */
    isColumnAction() {
        return this.column.isColumnAction();
    }

    /**
     * @return {boolean}
     */
    isColumnRowsCount() {
        return this.column.isColumnRowsCount();
    }

    /**
     * @return {boolean}
     */
    isGeneratedColumn() {
        return this.column.isGeneratedColumn();
    }

    /**
     * @return {string}
     */
    getFormDefaultValue() {
        return this.column.getFormDefaultValue();
    }

    /**
     * @param {jQuery|HTMLElement} row
     * @param {DatatableColumn} column
     * @param {*} value
     * @return {jQuery|HTMLElement}
     */
    static createFromData(row, column, value) {
        if(!column.isColumnAction()) {
            value = column.unsetFormDefaultValue(value);
            let
                _value = column.isColumnRowsCount()
                ? (column.datatable.rows.length + 1)
                : column.type.checkValue(value)
            ;
            let
                columnTd = $("<td></td>")
                    .html(_value)
                    .addClass("datatable-body-column")
                    .attr("data-column", column.name)
                    .attr("data-position", column.position)
                    .attr("data-value", _value)
                    .attr("data-raw-value", column.type.getRawValue(value))
                    .attr("data-compare-value", column.type.getCompareValue(_value, value))
            ;
            if(!column.isVisible()) columnTd.addClass(column.HTML_CLASS_HIDDEN);
            return columnTd;
        }
    }

    /**
     * @param {jQuery|HTMLElement} row
     * @param {DatatableColumn} column
     * @param {{
     *     visible: boolean,
     *     editable: boolean,
     *     columnEditable: boolean,
     *     copyable: boolean,
     *     deletable: boolean,
     * }} visibility
     * @return {jQuery|HTMLElement}
     */
    static generateActionColumn(row, column, visibility) {
        let columnTd = $("<td></td>")
                .addClass("datatable-body-column datatable-body-column-actions")
                .attr("data-column", column.name),
            coreActions = $("<div></div>")
            .addClass("datatable-column-core-actions")
        ;
        if(!column.isVisible()) columnTd.addClass(column.HTML_CLASS_HIDDEN);

        if(column.datatable.visible && visibility.visible) {
            coreActions.append(DatatableRowColumn
                .setIconAction(column.datatable.visible)
                .addClass("fa-eye datatable-action-visible")
                .attr("title", "Show " + row.attr("title"))
            );
        }
        if(column.datatable.editable && visibility.editable) {
            coreActions.append(DatatableRowColumn
                .setIconAction(column.datatable.editable)
                .addClass("fa-edit datatable-action-editable")
                .attr("title", "Edit " + row.data("title"))
            );
        }
        if(column.datatable.copyable && visibility.copyable) {
            coreActions.append(DatatableRowColumn
                .setIconAction(column.datatable.copyable)
                .addClass("fa-clone datatable-action-copyable")
                .attr("title", "Copy " + row.data("title"))
            );
        }
        if(column.datatable.deletable && visibility.deletable) {
            coreActions.append(DatatableRowColumn
                .setIconAction(column.datatable.deletable)
                .addClass("fa-trash datatable-action-deletable")
                .attr("title", "Delete " + row.data("title"))
            );
        }
        return columnTd.append(coreActions);
    }

    /**
     * @param {Route} route
     * @return {jQuery|HTMLElement}
     */
    static setIconAction(route) {
        return $("<i></i>")
            .addClass("fa datatable-column-action-icon")
            .attr("data-route", route.name)
            .attr("data-route-method", route.method)
        ;
    }

}

module.exports = DatatableRowColumn;