const DatatableColumnType = require("./datatable.column.type");
const DatatableColumnActionsAction = require("../actions/datatable.column.actions.action");

/**
 * @property {DatatableColumn} column
 * @property {boolean} visible
 * @property {Route|undefined} editable
 * @property {Route|boolean|undefined} searchable
 * @property {string} format
 * @property {string} defaultFormat
 * @property {{
 *     visible : PopUpCard,
 *     manage  : PopupFormCard,
 *     confirm  : PopupConfirmCard,
 * }} popups
 */
class DatatableColumnActionType extends DatatableColumnType {

    static NAME = DatatableColumnType.TYPE_ACTION;


    /**
     * @param {DatatableColumn} column
     * @param {object} data
     */
    constructor(column, data) {
        super(column, data);
        this.popups = {
            visible : co.popup.card(""),
            manage  : co.popup.form(""),
            confirm  : co.popup.confirm("", "", () => {}),
        };
    }

    getAction(column) {
        return new DatatableColumnActionsAction(this, column);
    }

}

module.exports = DatatableColumnActionType;