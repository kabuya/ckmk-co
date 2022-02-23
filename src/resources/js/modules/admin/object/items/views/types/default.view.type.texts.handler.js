const DefaultViewHandler = require("../default.view.handler");

/**
 * @property {DefaultViewsHandler} parent
 * @property {ViewContent} view
 */
class DefaultViewTypeTextsHandler extends DefaultViewHandler {


    constructor() {
        super();
    }

    handleView(view) {
        super.handleView(view);
        if(this.isViewOfRoute('admin:translator:index')) {
            let
                coreDom = this.getCoreDom()
            ;
            coreDom.find(".dt-btn").on("click", this.changeTranslatorDatatableView.bind(this));
        }
    }

    /**
     * @param {Event} e
     */
    changeTranslatorDatatableView(e) {
        let
            elem = $(e.currentTarget),
            coreDom = this.getCoreDom(),
            allTarget, allBtn
        ;
        if(!elem.hasClass("dt-active")) {
            allTarget = coreDom.find(".translator-element-target");
            allBtn = coreDom.find(".dt-btn");
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