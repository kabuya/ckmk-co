const Li = require("./li");

class MenuBase {

    initLiItem(lis, clickNavCb, clickLiCb) {
        let
            /**
             * @type {MenuBase}
             */
            this_o = this
        ;
        if(!this.items) {
            this.items = [];
        }
        lis.each((k, li) => {
            this_o.items.push(new Li(this_o, li, clickNavCb, clickLiCb));
        });
    }

}

module.exports = MenuBase;