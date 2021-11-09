const HTML_CLASS_ALERT_OPEN_CONTENT = "datatable-alert-message-open";
const HTML_CLASS_ALERT_SUCCESS = "_success";
const HTML_CLASS_ALERT_WARNING = "_warning";
const HTML_CLASS_ALERT_DANGER = "_danger";
const HTML_ICONS = {
    info    : "<i class='fa fa-info-circle'></i>",
    success : "<i class='fa fa-check-square-o'></i>",
    warning : "<i class='fa fa-exclamation-triangle'></i>",
    danger  : "<i class='fa fa-exclamation'></i>",
};


/**
 * @property {Datatable} datatable
 * @property {jQuery|HTMLElement} dom
 */
class DatatableAlert {

    /**
     * @param {Datatable} datatable
     */
    constructor(datatable) {
        this.datatable = datatable;
        /** @type {jQuery|HTMLElement} dom */
        this.dom = this.datatable.dom.find(".datatable-alert-message");
        this.setEvents();
    }

    /**
     * @param {string|string[]} message
     * @return {boolean}
     */
    info(message) {
        return this.openNewMessage("info", message);
    }

    /**
     * @param {string|string[]} message
     * @return {boolean}
     */
    success(message) {
        return this.openNewMessage("success", message);
    }

    /**
     * @param {string|string[]} message
     * @return {boolean}
     */
    warning(message) {
        return this.openNewMessage("warning", message);
    }

    /**
     * @param {string|string[]} message
     * @return {boolean}
     */
    danger(message) {
        return this.openNewMessage("danger", message);
    }

    /**
     * @param {string} type
     * @param {string|string[]} messages
     * @return {boolean}
     */
    openNewMessage(type, messages) {
        this.reset();
        if(!co.isSet(messages)) return this.close();
        if(type.in("success")) {
            this.dom.addClass(HTML_CLASS_ALERT_SUCCESS);
        } else if( type.in("warning")) {
            this.dom.addClass(HTML_CLASS_ALERT_WARNING);
        } else if( type.in("danger")) {
            this.dom.addClass(HTML_CLASS_ALERT_DANGER);
        }
        if(co.isString(messages)) messages = [messages];
        let
            this_o = this,
            content = this.dom.find(".datatable-alert-message-content")
        ;
        Object.entries(messages).forEach((keyValues, keyEntry) => {
            let
                key = keyValues[0],
                _msg = keyValues[1]
            ;
            if(co.isString(_msg)) {
                content.append([
                    "<div class='datatable-alert-message-item'>",
                        HTML_ICONS[type],
                        "<span>",
                            _msg,
                        "</span>",
                    "</div>",
                ].join(""));
            }
        });
        return this.open();
    }

    open() {
        if(this.isOpen()) return false;
        let this_o = this;
        co.timeOutChain(100, () => {
            this_o.dom
                .addClass(HTML_CLASS_ALERT_OPEN_CONTENT)
                .height(this.dom.find(".datatable-alert-message-content").outerHeight())
            ;
        });
        return true;
    }

    close() {
        if(this.isClose()) return false;
        let this_o = this;
        co.timeOutChain(300,
            () => {
                this_o.dom
                    .removeClass(HTML_CLASS_ALERT_OPEN_CONTENT)
                    .height(0)
                ;
            },
            () => {
                this_o.reset();
            }
        );
        return true;
    }

    reset() {
        this.dom
            .removeClass(HTML_CLASS_ALERT_SUCCESS)
            .removeClass(HTML_CLASS_ALERT_WARNING)
            .removeClass(HTML_CLASS_ALERT_DANGER)
            .find(".datatable-alert-message-content")
            .html("")
        ;
    }

    /**
     * @return {boolean}
     */
    isOpen() {
        return this.dom.hasClass(HTML_CLASS_ALERT_OPEN_CONTENT);
    }

    /**
     * @return {boolean}
     */
    isClose() {
        return !this.isOpen();
    }

    /**
     * @param {Event} e
     * @return {boolean}
     */
    closeMessage(e) {
        return this.close();
    }

    setEvents() {
        let
            this_o = this
        ;
        this.dom.find(".datatable-alert-message-close")
            .on("click", (e) => {this_o.closeMessage(e);})
        ;
    }

}

module.exports = DatatableAlert;