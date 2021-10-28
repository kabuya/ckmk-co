/**
 * @property {FormTab} FormTab
 * @property {jQuery|HTMLElement} head
 * @property {jQuery|HTMLElement} body
 * @property {{left:number,right:number}} position
 */
class FormTabItem {

    /**
     * @param {FormTab} FormTab
     * @param {jQuery|HTMLElement} head
     */
    constructor(FormTab, head) {
        this.FormTab = FormTab;
        this.head = $(head);
        this.body = FormTab.dom.find("div[data-target='"+ this.head.attr("id") +"']");
        this.position = this.head.position().left;
    }

    /**
     * @return {boolean}
     */
    isActive() {
        return this.head.hasClass("form-tab-active");
    }

    showTab(e) {
        if(!this.head.hasClass("form-tab-active")) {
            this.FormTab.hideAll();
            this.head.addClass("form-tab-active");
            this.body.addClass("form-tab-active");
            this.FormTab.currentTab = this;
            this.FormTab.moveDom(this.position, this.head.outerWidth());
        }
    }

    setEvents() {
        let
            this_o = this
        ;
        this.head.on("click", (e) => {
            this_o.showTab(e);
        });
    }

}

module.exports = FormTabItem;