const FormTabItem = require("./tabs/form.tab.item");

/**
 * @property {Form} Form
 * @property {jQuery|HTMLElement} dom
 * @property {FormTabItem[]} tabs
 * @property {number} lastPosition
 * @property {FormTabItem} currentTab
 */
class FormTab {

    /**
     * @param {Form} Form
     */
    constructor(Form) {
        this.Form = Form;
        this.dom = Form.dom.find(".form-tabs");
        this.lastPosition = this.dom.find(".form-tab-head").last().position().left;
        this.tabs = [];
        this.initTabs();
    }

    initTabs() {
        let
            this_o = this
        ;
        $.each(this.dom.find(".form-tab-head"), (k, tab) => {
            this_o.tabs.push(new FormTabItem(this_o, tab));
        });
    }

    /**
     * @return {FormTabItem}
     */
    getCurrentTab() {
        if(!this.currentTab) {
            let
                this_o = this
            ;
            this.tabs.forEach((tab) => {
                if(tab.isActive()) {
                    this_o.currentTab = tab;
                    return false;
                }
            });
        }
        return this.currentTab;
    }

    /**
     * @param {Event} e
     */
    moveByArrow(e) {
        let
            elem = $(e.currentTarget),
            currentTab = this.getCurrentTab(),
            otherTab
        ;
        if(currentTab) {
            if(elem.hasClass("form-tab-arrow-left")) {
                otherTab = currentTab.head.prev();
            } else {
                otherTab = currentTab.head.next();
            }
            if(otherTab) {
                otherTab.click();
            }
        }
    }

    setEvents() {
        let
            this_o = this
        ;
        this.dom.find(".form-tab-arrow").on("click", (e) => {
            this_o.moveByArrow(e);
        });
        this.tabs.forEach((tab) => {
            tab.setEvents();
        });
    }

    /**
     * @param {number} position
     * @param {number} width
     */
    moveDom(position, width) {
        let
            tabsHead =this.dom.find(".form-tabs-head")
        ;
        if(tabsHead.outerWidth() < this.lastPosition) {

            tabsHead.animate({
                scrollLeft : position,
            }, 300);
        }
    }

    hideAll() {
        this.dom.find(".form-tab-body").removeClass("form-tab-active");
        this.dom.find(".form-tab-head").removeClass("form-tab-active");
    }

    static init(Form) {
        if(Form.dom.find(".form-tabs").length) {
            let tab = new FormTab(Form);
            tab.setEvents();
            return tab;
        }
    }

}

module.exports = FormTab;