/**
 * @property {FormTab} formTab
 * @property {jQuery|HTMLElement} head
 * @property {jQuery|HTMLElement} body
 * @property {{left:number,right:number}} position
 */
class FormTabItem {

    /**
     * @param {FormTab} formTab
     * @param {jQuery|HTMLElement} head
     */
    constructor(formTab, head) {
        this.formTab = formTab;
        this.head = $(head);
        this.body = formTab.dom.find("div[data-target='"+ this.head.attr("id") +"']");
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
            this.formTab.hideAll();
            this.head.addClass("form-tab-active");
            this.body.addClass("form-tab-active");
            this.formTab.currentTab = this;
            this.formTab.moveDom(this.position, this.head.outerWidth());
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