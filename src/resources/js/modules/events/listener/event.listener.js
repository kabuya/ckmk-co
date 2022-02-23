/**
 * @property {string} name
 * @property {(Function|array)[]} callbacks
 * @property {(Function|array)[]} beforeCallbacks
 * @property {(Function|array)[]} afterCallbacks
 */
class EventListener {

    /**
     * @param {string} name
     * @constructor
     */
    constructor(name) {
        this.name = name;
        /** @type {(Function|array)[]} callbacks */
        this.callbacks = [];
        /** @type {(Function|array)[]} beforeCallbacks */
        this.beforeCallbacks = [];
        /** @type {(Function|array)[]} afterCallbacks */
        this.afterCallbacks = [];
    }

    /**
     * @param args
     */
    exec(...args) {
        this.execCallbackFromList(Array.compact(
            this.beforeCallbacks,
            this.callbacks,
            this.afterCallbacks
        ), ...args);
        return true;
    }

    /**
     * @param {(Function|array)[]} list
     * @param args
     */
    execCallbackFromList(list, ...args) {
        list.forEach((cb) => {
            co.runCb(cb, ...args);
        });
    }

    // Callback
    /**
     * @param {Function|array} cb
     */
    addCallback(cb) {
        return this.addOnList(this.callbacks, cb);
    }

    /**
     * @param {Function|array} cb
     */
    removeCallback(cb) {
        let
            callbacks = this.removeOnList(this.callbacks, cb)
        ;
        if(callbacks.length !== this.callbacks.length) {
            this.callbacks = callbacks;
            return true;
        }
        return false;
    }

    // Before Callback
    /**
     * @param {Function|array} cb
     */
    addBeforeCallback(cb) {
        return this.addOnList(this.beforeCallbacks, cb);
    }

    /**
     * @param {Function|array} cb
     */
    removeBeforeCallback(cb) {
        let
            beforeCallbacks = this.removeOnList(this.beforeCallbacks, cb)
        ;
        if(beforeCallbacks.length !== this.beforeCallbacks.length) {
            this.beforeCallbacks = beforeCallbacks;
            return true;
        }
        return false;
    }

    // After Callback
    /**
     * @param {Function|array} cb
     */
    addAfterCallback(cb) {
        return this.addOnList(this.afterCallbacks, cb);
    }

    /**
     * @param {Function|array} cb
     */
    removeAfterCallback(cb) {
        let
            afterCallbacks = this.removeOnList(this.afterCallbacks, cb)
        ;
        if(afterCallbacks.length !== this.afterCallbacks.length) {
            this.afterCallbacks = afterCallbacks;
            return true;
        }
        return false;
    }

    /**
     * @param {(Function|array)[]} list
     * @param {Function|array} cb
     */
    addOnList(list, cb) {
        if(co.isFunction(cb)) {
            list.push(cb);
            return true;
        }
        return false;
    }

    /**
     * @param {(Function|array)[]} list
     * @param {Function|array} cb
     */
    hasOnList(list, cb) {
        let this_o = this;
        return (list.filter((_cb) => {
            return this_o.foundCB(_cb, cb);}
        ).length > 0);
    }

    /**
     * @param {(Function|array)[]} list
     * @param {Function|array} cb
     */
    removeOnList(list, cb) {
        let
            this_o = this,
            newList
        ;
        newList = list.filter((_cb) => {
            return this_o.foundCB(_cb, cb, false);
        });
        if(newList.length !== list.length) return newList;
        return list;
    }

    /**
     * @param {Function|array} _cb
     * @param {Function|array} cb
     * @param {boolean} same
     */
    foundCB(_cb, cb, same = true) {
        if(co.isArray(cb)) {
            if(co.isArray(_cb)) {
                if(same) return _cb[0] === cb[0] && _cb[1] === cb[1];
                return _cb[0] !== cb[0] || _cb[1] !== cb[1];
            }
            return !same;
        }
        if(same) return _cb === cb;
        return _cb !== cb;
    }

    /**
     * @return {boolean}
     */
    hasCallback() {
        return (
            !(!!this.callbacks.length)
            ||
            !(!!this.afterCallbacks.length)
            ||
            !(!!this.beforeCallbacks.length)
        );
    }

    /**
     * @return {(Function|array)[]}
     */
    getCallbacks() {
        return this.callbacks;
    }

}

module.exports = EventListener;
