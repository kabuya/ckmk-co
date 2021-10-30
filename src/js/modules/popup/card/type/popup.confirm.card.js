const PopupCard = require("../popup.card");


/**
 * @property {PopUp} PopUp
 * @property {jQuery|HTMLElement} dom
 * @property {jQuery|HTMLElement} core
 * @property {string} ID
 * @property {string} title
 * @property {string|undefined} content
 * @property {string} type
 * @property {number} position
 * @property {boolean} appended
 * @property {number|undefined} waiting
 * @property {Function|array} cb
 */
class PopupConfirmCard extends PopupCard {


    static NAME = PopupCard.TYPE_CONFIRM;


    /**
     * @param {PopUp} PopUp
     * @param {string} title
     * @param {string|undefined} content
     * @param {Function|array} cb
     */
    constructor(
        PopUp,
        title,
        content,
        cb
    ) {
        super(
            PopUp,
            title,
            content,
            PopupConfirmCard.NAME
        );
        /** @type {Function|array} cb */
        this.cb = cb;
    }

    /**
     * @return {string}
     */
    getButtons() {
        return [
            "<button class='popup-button popup-btn-confirm'>Confirm</button>",
            "<button class='popup-button popup-btn-cancel'>Annuler</button>",
        ].join("");
    }

    buttonOnClick(e) {
        let
            btn = $(e.currentTarget),
            confirm = btn.hasClass("popup-btn-confirm")
        ;
        if(co.isFunction(this.cb)) co.runCb(this.cb, confirm);
        return this.close(true);
    }

}

module.exports = PopupConfirmCard;