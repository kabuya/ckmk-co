let
    /** @type {{callback:(Function), targetRoutes:(string|string[])}[]} callbacks */
    callbacks = [],
    executedCallbacks = [],
    domLoaded = false,
    routerDefine = false,
    step = 0
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
        if(step === 10) return;
        if(!window.co || !window.co.router) {
            let this_o = this;
            step++;
            setTimeout(() => {
                this_o.#executeSaveCallback();
            }, 100);
            return;
        }
        domLoaded = routerDefine = true;
        if(callbacks.length) {
            let this_o = this;
            callbacks.forEach((item, k) => {
                if(!executedCallbacks.contains(item)) {
                    this_o.loaded(item.callback, item.targetRoutes);
                    executedCallbacks.push(item);
                }
            });
        }
    }

    #setEvents() {
        document.addEventListener('DOMContentLoaded', this.#executeSaveCallback.bind(this));
    }

}

module.exports = new DocumentHtml;