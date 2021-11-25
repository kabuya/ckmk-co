let
    /** @type {{callback:(Function), targetRoutes:(string|string[])}[]} callbacks */
    callbacks = [],
    domLoaded = false,
    routerDefine = false
;
class DocumentHtml {

    constructor() {
        this.#setEvents();
    }

    /**
     * @param {Function} callback
     * @param {string|string[]} targetRoutes
     */
    loaded(callback, targetRoutes = null) {
        if(domLoaded && routerDefine) {
            if(co.isCallable(callback)) {
                let
                    canRun = true
                ;
                if(co.isString(targetRoutes)) targetRoutes = [targetRoutes];
                if(co.isArray(targetRoutes)) {
                    let
                        currentRoute = co.router.getCurrentRoute()
                    ;
                    if(currentRoute) canRun = (targetRoutes.indexOf(currentRoute.name) > -1);
                }
                if(canRun) co.runCb(callback);
            }
        } else {
            callbacks.push({
                callback:callback,
                targetRoutes:targetRoutes,
            });
        }
    }

    #executeSaveCallback() {
        if(!window.co || !window.co.router) {
            let this_o = this;
            setTimeout(() => {
                this_o.#executeSaveCallback();
            }, 100);
            return;
        }
        domLoaded = routerDefine = true;
        if(callbacks.length) {
            let this_o = this;
            callbacks.forEach((item, k) => {
                this_o.loaded(item.callback, item.targetRoutes);
                callbacks.splice(k, 1);
            });
        }
    }

    #setEvents() {
        let this_o = this;
        document.addEventListener('DOMContentLoaded', (e) => {
            this_o.#executeSaveCallback(e);
        });
    }

}

module.exports = new DocumentHtml;