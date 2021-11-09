const EventTypes = require("../../events/listener/event.types");

const TIME_OUT = 200;
const TYPE_CARD = "card";
const TYPE_FORM = "form";
const TYPE_CONFIRM = "confirm";
const TYPE_IFRAME = "iframe";

const HIDDEN_DIRECTION_TOP = "popup-top";
const HIDDEN_DIRECTION_DOWN = "popup-bottom";
const HIDDEN_DIRECTION_VISIBILITY = "popup-hide";

const HIDDEN_DIRECTIONS = [
    HIDDEN_DIRECTION_TOP,
    HIDDEN_DIRECTION_DOWN,
    HIDDEN_DIRECTION_VISIBILITY,
];

const BEFORE_SHOW = "popup.before.show";
const AFTER_SHOW = "popup.after.show";
const BEFORE_CLOSE = "popup.before.close";
const AFTER_CLOSE = "popup.after.close";

const EVENTS = [
    BEFORE_SHOW,
    AFTER_SHOW,
    BEFORE_CLOSE,
    AFTER_CLOSE,
];

const HTML_DOM = [
    "<div class='popup-card popup-hide popup-top'>",
        "<div class='popup-header'>",
            "<div class='popup-title'></div>",
            "<div class='popup-close'><i class='fa fa-close'></i></div>",
        "</div>",
        "<div class='popup-content'></div>",
        "<div class='popup-footer'></div>",
    "</div>",
].join("")

let
    destroy,
    request = {},
    pcXhr
;

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
 * @property {string} hiddenDirection
 */
class PopUpCard extends EventTypes {


    static TIME_OUT = TIME_OUT;
    static TYPE_CARD = TYPE_CARD;
    static TYPE_FORM = TYPE_FORM;
    static TYPE_CONFIRM = TYPE_CONFIRM;
    static TYPE_IFRAME = TYPE_IFRAME;

    static NAME = TYPE_CARD;


    /**
     * @param {PopUp} popup
     * @param {string} title
     * @param {string|undefined} content
     * @param {string} type
     */
    constructor(
        popup,
        title,
        content,
        type
    ) {
        super();
        this.addAcceptedEvents(EVENTS);
        /** @type {jQuery|HTMLElement} dom */
        this.dom = $(HTML_DOM);
        this.dom.addClass("popup-type-" + type);
        /** @type {jQuery|HTMLElement} core */
        this.core = this.dom.find(".popup-content");
        /** @type {PopUp} popup */
        this.popup = popup;
        /** @type {string} ID */
        this.ID = co.generate(10);
        /** @type {string} title */
        this.type = type;
        /** @type {number} title */
        this.position = popup.getCardPosition();
        /** @type {boolean} title */
        this.appended = false;
        this.hiddenDirection = HIDDEN_DIRECTION_TOP;
        this.setTitle(title);
        this.setContent(content);
        // co.log(this);
    }

    /**
     * @return {PopUpCard|undefined}
     */
    next() {
        return this.popup.getCardByPosition(this.position + 1);
    }

    /**
     * @return {PopUpCard|undefined}
     */
    prev() {
        return this.popup.getCardByPosition(this.position - 1);
    }

    /**
     * @param {number} waiting
     * @return {PopUpCard}
     */
    wait(waiting) {
        if(!co.isInt(waiting) || waiting < 0) waiting = 0;
        this.waiting = waiting;
        return this;
    }

    /**
     * @param {string} path
     * @param {object} data
     * @param {string|get} method
     * @return {PopUpCard}
     */
    load(path, data, method = "get") {
        if(!request[this.ID] && co.isString(path, method)) {
            request[this.ID] = {
                path : path,
                data : co.isObject(data) ? data : {},
                method : method
            };
        }
        return this;
    }

    /**
     * @param {string} hiddenDirection
     * @return {PopUpCard}
     */
    setHiddenDirection(hiddenDirection) {
        if((""+hiddenDirection).in(...HIDDEN_DIRECTIONS)) {
            this.hiddenDirection = hiddenDirection;
        }
        return this;
    }

    /**
     * @return {boolean}
     */
    isVisible() {
        return (
            !this.dom.hasClass(HIDDEN_DIRECTION_DOWN)
            &&
            !this.dom.hasClass(HIDDEN_DIRECTION_TOP)
            &&
            !this.dom.hasClass(HIDDEN_DIRECTION_VISIBILITY)
        );
    }

    /**
     * @return {boolean}
     */
    show() {
        if(this.isVisible()) return false;
        this.dom.removeClass(HIDDEN_DIRECTIONS.join(" "));
        return true;
    }

    /**
     * @return {boolean}
     */
    hide() {
        if(!this.isVisible()) return false;
        this.dom.addClass([this.hiddenDirection, HIDDEN_DIRECTION_VISIBILITY].join(" "));
        return true;
    }

    /**
     * @return {boolean}
     */
    isOpen() {
        return this.appended;
    }

    /**
     * @return {boolean}
     */
    isClosed() {
        return !this.appended;
    }

    open() {
        if(!this.appended) {
            this.appended = true;
            let
                this_o = this
            ;
            this.loadContent();
            this.popup.append(this);
            if(!this.dom.find(".popup-load").length) this.executeDisplayType();
            setTimeout(function () {
                this_o.show();
            }, this.timeOut());
        }
    }

    close() {
        if(this.appended) {
            this.run(this.BEFORE_CLOSE, this);
            this.appended = false;
            let
                this_o = this
            ;
            this.resetXHR();
            this.hide();
            this_o.popup.removeOpenedCard(this);
            setTimeout(function () {
                if(!this_o.popup.isOpenedCard(this_o)) this_o.dom.remove();
                if(destroy) this_o.popup.removeCard(this);
                this_o.run(this_o.AFTER_CLOSE, this_o);
            }, this.timeOut());
        }
    }

    /**
     * @return {number}
     */
    timeOut() {
        return this.waiting || TIME_OUT;
    }

    destroy() {
        if(this.appended) {
            this.close();
        }
        this.popup.removeCard(this);
    }

    /**
     * @param {string} title
     * @return {PopUpCard}
     */
    setTitle(title) {
        /** @type {string} title */
        this.title = title;
        this.dom.find(".popup-title").html(title);
        return this;
    }

    /**
     * @param {string} content
     * @return {PopUpCard}
     */
    setContent(content) {
        if(content) this.core.html(content);
        /** @type {string|undefined} content */
        this.content = content;
        return this;
    }

    /**
     * @return {PopUpCard}
     */
    setButtons() {
        this.dom.find(".popup-footer").html(this.getButtons());
        return this;
    }

    /**
     * @return {string}
     */
    getButtons() {
        return "<button class='popup-button popup-btn-card'>Ok</button>";
    }

    loadContent() {
        if(request[this.ID]) {
            let
                this_o = this,
                this_request = request[this.ID]
            ;
            delete request[this.ID];
            this.setContent("<div class='popup-load'></div>");
            pcXhr = co.ajax.build()
                .setUrl(this_request.path)
                .setData(this_request.data)
                .setType(this_request.method)
                .setBeforeSend((xhr, settings) => {
                    this_o.run(this_o.BEFORE_SHOW, this_o, xhr, settings);
                })
                .setSuccess((response, status, xhr) => {
                    return this_o.setContentFromRequest(response, status, xhr);
                })
                .setError((xhr, status, statusTitle) => {
                    let
                        content = [
                            "<div style='color: #fb5656'>",
                                "<div style='margin-bottom:5px;'>Status Code : <b>"+ xhr.status +"</b></div>",
                                "<div>Response content :</div>",
                                "<div><b>"+ xhr.responseText +"</b></div>",
                            "</div>",
                        ].join("")
                    ;
                    return this_o.setContentFromRequest(content, status, xhr);
                })
            ;
            pcXhr.execute()
        } else {
            this.setButtons();
            this.setButtonEvent();
            this.run(this.AFTER_SHOW, this);
        }
    }

    setContentFromRequest(response, status, xhr) {
        let
            this_o = this
        ;
        this.resetXHR();
        setTimeout(function () {
            let contentType = xhr.getResponseHeader("Content-Type");
            if(co.isString(contentType) && !!contentType.match(/html|text/i)) {
                this_o.setContent(response);
                this_o.setButtons();
                this_o.setButtonEvent();
                this_o.executeDisplayType();
            } else {
                this_o.setContent("The request response is not HTML content or TEXT/PLAIN");
            }
            this_o.run(this_o.AFTER_SHOW, this_o, response, status, xhr);
        }, this.timeOut());
    }

    setButtonEvent() {
        if(!destroy) {
            let
                this_o = this
            ;
            this.dom.find(".popup-close").on("click", function (e) {
                this_o.close();
            });
            $.each(this.dom.find(".popup-button"), function (btnKey, btn) {
                btn = $(btn);
                btn.on("click", function (e) {
                    this_o.buttonOnClick(e);
                });
            });
        }
    }

    executeDisplayType() {
    }

    /**
     * @param {Event} e
     */
    buttonOnClick(e) {
        return this.close();
    }

    /**
     * @param {boolean} abort
     */
    resetXHR(abort = true) {
        if(pcXhr) {
            if(abort) pcXhr.Ajax.abort();
            pcXhr = undefined;
        }
    }
}

PopUpCard.prototype.BEFORE_SHOW = BEFORE_SHOW;
PopUpCard.prototype.AFTER_SHOW = AFTER_SHOW;
PopUpCard.prototype.BEFORE_CLOSE = BEFORE_CLOSE;
PopUpCard.prototype.AFTER_CLOSE = AFTER_CLOSE;
PopUpCard.prototype.HIDDEN_DIRECTION_TOP = HIDDEN_DIRECTION_TOP;
PopUpCard.prototype.HIDDEN_DIRECTION_DOWN = HIDDEN_DIRECTION_DOWN;
PopUpCard.prototype.HIDDEN_DIRECTION_VISIBILITY = HIDDEN_DIRECTION_VISIBILITY;
PopUpCard.prototype.HIDDEN_DIRECTIONS = HIDDEN_DIRECTIONS;

module.exports = PopUpCard;
