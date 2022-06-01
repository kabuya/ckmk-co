let
    /** @type {{callback:(Function), targetRoutes:(((route: string) => boolean)|string|string[])}[]} callbacks */
    callbacks = [],
    /** @type {{callback:(Function), targetRoutes:(((route: string) => boolean)|string|string[])}[]} registeredCallback */
    registeredCallback = [],
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
     * @param {((route: string) => boolean)|string|string[]|null} targetRoutes
     * @param {boolean} register
     */
    loaded(callback, targetRoutes = null, register = false) {
        if(register) this.#registerCallback(callback, targetRoutes);
        if(domLoaded && routerDefine) {
            this.#executeCallback(callback, targetRoutes);
        } else {
            callbacks.push({
                callback:callback,
                targetRoutes:targetRoutes,
            });
        }
    }

    executeRegister() {
        const this_o = this;
        registeredCallback.forEach(item => {
            this_o.#executeCallback(item.callback, item.targetRoutes);
        });
    }

    /**
     * @param {Function} callback
     * @param {((route: string) => boolean)|string|string[]|null} targetRoutes
     */
    #executeCallback(callback, targetRoutes = null) {
        if(co.isCallable(callback)) {
            let canRun = true;
            if(co.isString(targetRoutes)) targetRoutes = [targetRoutes];
            if(co.isArray(targetRoutes) && targetRoutes.length) canRun = co.routing.isCurrentIn(...targetRoutes);
            else if(co.isCallable(targetRoutes)) canRun = !!co.runCb(targetRoutes, co.routing.current());
            co.log(targetRoutes);
            if(canRun) co.runCb(callback);
        }
    }

    /**
     * @param {Function} callback
     * @param {((route: string) => boolean)|string|string[]|null} targetRoutes
     */
    #registerCallback(callback, targetRoutes = null) {
        if(!registeredCallback.find(_cb => _cb.callback === callback)) {
            registeredCallback.push({
                callback: callback,
                targetRoutes: targetRoutes,
            });
        }
    }

    #executeSaveCallback() {
        if(step === 10) return;
        if(!window.co || !window.co.routing || !window.co.routing.isInitialized()) {
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