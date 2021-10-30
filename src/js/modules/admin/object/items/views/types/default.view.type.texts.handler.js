const DefaultViewHandler = require("../default.view.handler");

class DefaultViewTypeTextsHandler extends DefaultViewHandler {


    constructor() {
        super();
    }

    handleView(view) {
        super.handleView(view);
        if(this.view.route.isRoute('admin:translator:index')) {
            let
                this_o = this
            ;
            this.view.dom.find(".dt-btn").on("click", (e) => {
                this_o.changeTranslatorDatatableView(e);
            });
        }
    }

    /**
     * @param {Event} e
     */
    changeTranslatorDatatableView(e) {
        let
            elem = $(e.currentTarget),
            allTarget, allBtn
        ;
        if(!elem.hasClass("dt-active")) {
            allTarget = this.view.dom.find(".translator-element-target");
            allBtn = this.view.dom.find(".dt-btn");
            allTarget
                .addClass("hidden")
                .each((k, target) => {
                    target = $(target);
                    if(target.data("table") === elem.data("target")) {
                        target.removeClass("hidden");
                    }
                })
            ;
            allBtn.removeClass("dt-active");
            elem.addClass("dt-active");
        }
    }

}

module.exports = DefaultViewTypeTextsHandler;