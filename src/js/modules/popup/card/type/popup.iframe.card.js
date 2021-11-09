const PopupCard = require("../popup.card");

/**
 * @property {PopUp} PopUp
 * @property {jQuery|HTMLElement} dom
 * @property {jQuery|HTMLElement} core
 * @property {string} ID
 * @property {string} title
 * @property {string} url
 * @property {string|undefined} content
 * @property {string} type
 * @property {number} position
 * @property {boolean} appended
 * @property {number|undefined} waiting
 * @property {string} hiddenDirection
 * @property {boolean} styleInit
 */
class PopupIframeCard extends PopupCard {


    static NAME = PopupCard.TYPE_IFRAME;


    /**
     * @param {PopUp} PopUp
     * @param {string} title
     * @param {string} url
     */
    constructor(
        PopUp,
        title,
        url
    ) {
        super(
            PopUp,
            title,
            url,
            PopupIframeCard.NAME
        );
        this.url = url;
        this.styleInit = false;
    }

    setStyleForIframes() {
        let this_o = this;
        this.dom.find("iframe").on("load", (e) => {
            this_o.setStyleForIframe(e);
        });
    }

    /**
     * @param {Event} e
     */
    setStyleForIframe(e) {
        let
            elem = $(e.currentTarget)
        ;
        elem.contents().find("head").append([
            "<style>",
                "img {width:100%;}",
                "::-webkit-scrollbar {width: 6px;}",
                "::-webkit-scrollbar-thumb {background-color: #6ac8b5;}",
                "::-webkit-scrollbar-track {background-color: #cfeeda;}",
            "</style>"
        ].join("\r\n"));
    }

    /**
     * @param {string} url
     * @return {PopUpCard}
     */
    setContent(url) {
        if(url) {
            this.styleInit = false;
            let
                iframe = $("<iframe></iframe>")
            ;
            iframe.attr("title", this.title);
            iframe.attr("src", url);
            iframe.attr("width", "300");
            iframe.attr("height", "200");
            this.core.html(iframe);
            /** @type {string|undefined} content */
            this.content = iframe.prop("outerHTML");
        }
        return this;
    }

    executeDisplayType() {
        if(!this.styleInit) {
            this.styleInit = true;
            this.setStyleForIframes();
        }
    }

}

module.exports = PopupIframeCard;