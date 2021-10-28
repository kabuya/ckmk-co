const PopUpCard = require("./card/popup.card");
const PopUpConfirmCard = require("./card/type/popup.confirm.card");
const PopUpFormCard = require("./card/type/popup.form.card");
const PopUpIframeCard = require("./card/type/popup.iframe.card");

const CARDS = [
    PopUpCard,
    PopUpConfirmCard,
    PopUpFormCard,
    PopUpIframeCard
];

let
    dom = [
        "<div class='popup-container'>",
        "</div>",
    ].join(""),
    /** @type {(
     * PopUpCard
     * |PopUpConfirmCard
     * |PopUpFormCard
     * |PopUpIframeCard
    )[]} cards */
    cards = [],
    /** @type {(
     * PopUpCard
     * |PopUpConfirmCard
     * |PopUpFormCard
     * |PopUpIframeCard
    )[]} hiddenToShow */
    hiddenToShow = [],
    appended = false,
    container = $("body")
;

class PopUp {

    /**
     * @param {string} title
     * @param {string|undefined} content
     * @return {PopUpCard}
     */
    card(title, content = undefined) {
        let card = new PopUpCard(this, title, content, "card");
        cards.push(card);
        return card;
    }

    /**
     * @param {string} title
     * @param {string|undefined} content
     * @param {function|array} cb
     * @return {PopUpConfirmCard}
     */
    confirm(title, content = undefined, cb) {
        let card = new PopUpConfirmCard(this, title, content, cb);
        cards.push(card);
        return card;
    }

    /**
     * @param {string} title
     * @param {string|undefined} content
     * @param {boolean} useFormClass
     * @return {PopUpFormCard}
     */
    form(title, content = undefined, useFormClass = true) {
        let card = new PopUpFormCard(this, title, content, useFormClass);
        cards.push(card);
        return card;
    }

    /**
     * @param {string} title
     * @param {string} url
     * @return {PopUpIframeCard}
     */
    iframe(title, url) {
        let card = new PopUpIframeCard(this, title, url);
        cards.push(card);
        return card;
    }

    /**
     * @return {(
     * PopUpCard
     * |PopUpConfirmCard
     * |PopUpFormCard
     * |PopUpIframeCard
    )[]}
     */
    getCards() {
        return cards;
    }

    /**
     * @param position
     * @return {(
     * PopUpCard
     * |PopUpConfirmCard
     * |PopUpFormCard
     * |PopUpIframeCard
    )|undefined}
     */
    getCardByPosition(position) {
        return cards[position];
    }

    /**
     * @return {number}
     */
    getCardPosition() {
        return cards.length;
    }

    /**
     * @return {boolean}
     */
    show() {
        if(!appended) {
            appended = true;
            if(co.isString(dom)) dom = $(dom);
            container.prepend(dom);
        }
        return false;
    }

    /**
     * @param {jQuery|HTMLElement} _container
     * @return {PopUp}
     */
    setContainer(_container) {
        _container = $(_container);
        if(_container.length) {
            container = _container;
        }
        return this;
    }

    /**
     * @return {boolean}
     */
    hide() {
        if(this.canClose()) {
            dom.remove();
            return true;
        }
        return false;
    }

    /**
     * @return {boolean}
     */
    canClose() {
        if(appended) {
            appended = false;
            cards.forEach((card) => {
                if(card.appended && !appended) {
                    appended = true;
                    return false;
                }
            });
        }
        return !appended;
    }

    /**
     * @param {(
     * PopUpCard
     * |PopUpConfirmCard
     * |PopUpFormCard
     * |PopUpIframeCard
    )} card
     */
    append(card) {
        if(this.hasCard(card)) {
            this.show();
            dom.append(card.dom);
            return true;
        }
        return false;
    }

    /**
     * @return {(
     * PopUpCard
     * |PopUpConfirmCard
     * |PopUpFormCard
     * |PopUpIframeCard
    )|undefined}
     */
    getLastCardFromHiddenToShowList() {
        return hiddenToShow[(hiddenToShow.length - 1)];
    }

    /**
     * @return {(
     * PopUpCard
     * |PopUpConfirmCard
     * |PopUpFormCard
     * |PopUpIframeCard
    )[]}
     */
    getHiddenToShowList() {
        return hiddenToShow;
    }

    /**
     * @param {(
     * PopUpCard
     * |PopUpConfirmCard
     * |PopUpFormCard
     * |PopUpIframeCard
    )} card
     * @return {number}
     */
    appendToHiddenToShowList(card) {
        if(!co.instanceOf(card, ...CARDS)) return -1;
        return hiddenToShow.push(card);
    }

    /**
     * @param {(
     * PopUpCard
     * |PopUpConfirmCard
     * |PopUpFormCard
     * |PopUpIframeCard
     * |string
    )} card
     * @return {boolean}
     */
    removeToHiddenToShowList(card) {
        let
            list = hiddenToShow.filter((_card) => {
                return card !== _card && card !== _card.ID;
            })
        ;
        if(list.length !== hiddenToShow.length) {
            hiddenToShow = list;
            return true;
        }
        return false;
    }

    /**
     * @param {(
     * PopUpCard
     * |PopUpConfirmCard
     * |PopUpFormCard
     * |PopUpIframeCard
     * |string
    )} card
     * @return {boolean}
     */
    hasCard(card) {
        if(!co.instanceOf(card, ...CARDS)) return false;
        return (cards.filter((_card) => {
            return (
                card === _card
                ||
                card === _card.ID
            );
        }).length > 0);
    }

    /**
     * @param {(
     * PopUpCard
     * |PopUpConfirmCard
     * |PopUpFormCard
     * |PopUpIframeCard
     * |string
    )} card
     @return {boolean}
     */
    removeCard(card) {
        let
            list = cards.filter((_card) => {
                return card !== _card && card !== _card.ID;
            })
        ;
        if(list.length !== cards.length) {
            cards = list;
            return true;
        }
        return false;
    }
}

module.exports = new PopUp();
