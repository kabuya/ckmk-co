const DefaultViewHandler = require("../default.view.handler");

class DefaultViewTypeTextsHandler extends DefaultViewHandler {


    constructor() {
        super();

    }

    /**
     * @param {Route|undefined} route
     */
    setEventByMatchedRoute(route) {
        if(route && route.isRoute('admin:translator:index')) {
            let
                this_o = this,
                coreDom = this.getCoreDom()
            ;
            coreDom.find(".dt-btn").on("click", (e) => {
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