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
 * @property {Form|undefined} currentForm
 * @property {string} hiddenDirection
 * @property {boolean} useFormClass
 * @property {Function} successCallback
 * @property {Function} securityTokenUpdateCallback
 * @property {boolean} formInit
 */
class PopupFormCard extends PopupCard {


    static NAME = PopupCard.TYPE_FORM;


    /**
     * @param {PopUp} PopUp
     * @param {string} title
     * @param {string|undefined} content
     * @param {boolean} useFormClass
     */
    constructor(
        PopUp,
        title,
        content,
        useFormClass = true
    ) {
        super(
            PopUp,
            title,
            content,
            PopupFormCard.NAME
        );
        this.useFormClass = useFormClass;
        this.formInit = false;
    }

    setContent(content) {
        super.setContent(content);
        if(content && !content.match(/popup-load/i)) {
            this.formInit = false;
            /** @type {jQuery|HTMLElement} form */
            let form = this.core.find("form");
            if(!form.length) {
                this.core.html("No forms found in the content received");
            } else if(form.length > 1) {
                this.core.html("You can use only one form on this popup.");
            }
        }
        return this;
    }

    iniForms() {
        /** @type {jQuery|HTMLElement} form */
        let form = this.core.find("form");
        if(form.length) {
            co.form.init(form, true);
            this.currentForm = co.form.getForm(form.attr("id"));
            if(this.securityTokenUpdateCallback) {
                this.currentForm.on(co.form.EVENT_SECURITY_TOKEN_UPDATE, this.securityTokenUpdateCallback);
            }
            this.currentForm.on(co.form.EVENT_REQUEST_SUCCESS, [this, "checkResponse"]);
        }
    }

    /**
     * @param {object} response
     * @param status
     * @param xhr
     * @param {Form} form
     */
    checkResponse(response, status, xhr, form) {
        if(!form.hasErrors()) {
            if(co.isFunction(this.successCallback)) {
                co.runCb(this.successCallback, response, status, xhr);
            }
            this.close();
        }
    }

    /**
     * @param {Function|Array} successCallback
     * @return {PopupFormCard}
     */
    onSuccess(successCallback) {
        this.successCallback = successCallback;
        return this;
    }

    /**
     * @param {Function|Array} securityTokenUpdateCallback
     * @return {PopupFormCard}
     */
    onSecurityTokenUpdate(securityTokenUpdateCallback) {
        this.securityTokenUpdateCallback = securityTokenUpdateCallback;
        return this;
    }

    executeDisplayType() {
        if(!this.formInit) {
            this.formInit = true;
            this.iniForms();
        }
    }

    getButtons() {
        return [
            "<button class='popup-button popup-btn-submit'>Submit</button>",
            "<button class='popup-button popup-btn-cancel'>Annuler</button>",
        ].join("");
    }

    buttonOnClick(e) {
        let
            btn = $(e.currentTarget)
        ;
        if(btn.hasClass("popup-btn-cancel")) {
            return this.close();
        }
        this.core.find("form").submit();
    }

}

module.exports = PopupFormCard;