const EventListener = require("./listener/event.listener");

/**
 * @property {EventListener[]} events
 */
class EventHandler {

    constructor() {
        /** @type {EventListener[]} */
        this.events = [];
    }

    /**
     * @param {string} name
     * @return {boolean}
     */
    isValidName(name) {
        return co.isString(name) && !name.match(/\r\n|\n/i);
    }

    /**
     * @param {string} name
     */
    register(name) {
        if(this.isValidName(name) && !this.hasEvent(name)) {
            this.events.push(new EventListener(name));
            return true;
        }
        return false;
    }

    /**
     * @param {string|EventListener} event
     * @return {boolean}
     */
    remove(event) {
        let
            events = this.events.filter((_event) => {
                return (
                    _event !== event
                    &&
                    _event.name !== event
                );
            })
        ;
        if(events.length !== this.events.length) {
            this.events = events;
            return true;
        }
        return false;
    }

    /**
     * @param {string} name
     * @param args
     * @return {boolean}
     */
    exec(name, ...args) {
        let listener = this.getEvent(name);
        if(listener) {
            return listener.exec(...args);
        }
        return false;
    }

    /**
     * @param {string} name
     * @param {function} cb
     * @return {boolean}
     */
    listen(name, cb) {
        if(!this.hasEvent(name)) this.register(name);
        let listener = this.getEvent(name);
        if(listener) {
            return listener.addCallback(cb);
        }
        return false;
    }

    /**
     * @param {string} name
     * @param {function} cb
     * @return {boolean}
     */
    beforeListen(name, cb) {
        if(!this.hasEvent(name)) this.register(name);
        let listener = this.getEvent(name);
        if(listener) {
            return listener.addBeforeCallback(cb);
        }
        return false;
    }

    /**
     * @param {string} name
     * @param {function} cb
     * @return {boolean}
     */
    afterListen(name, cb) {
        if(!this.hasEvent(name)) this.register(name);
        let listener = this.getEvent(name);
        if(listener) {
            return listener.addAfterCallback(cb);
        }
        return false;
    }

    /**
     * @param {string} name
     * @param {function} cb
     * @return {boolean}
     */
    removeCallback(name, cb) {
        let listener = this.getEvent(name);
        if(listener) {
            if(listener.removeCallback(cb)) {
                if(!listener.hasCallback()) this.remove(listener);
                return true;
            }
        }
        return false;
    }

    /**
     * @param {string} name
     * @param {function} cb
     * @return {boolean}
     */
    removeBeforeCallback(name, cb) {
        let listener = this.getEvent(name);
        if(listener) {
            return listener.removeBeforeCallback(cb);
        }
        return false;
    }

    /**
     * @param {string} name
     * @param {function} cb
     * @return {boolean}
     */
    removeAfterCallback(name, cb) {
        let listener = this.getEvent(name);
        if(listener) {
            return listener.removeAfterCallback(cb);
        }
        return false;
    }

    /**
     * @param {string|EventListener} event
     * @return {EventListener|undefined}
     */
    getEvent(event) {
        return this.events.filter((_event) => {
            return (
                _event === event
                ||
                _event.name === event
            );
        })[0];
    }

    /**
     * @param {string} name
     * @return {boolean}
     */
    hasEvent(name) {
        return co.isObject(this.getEvent(name));
    }

    /**
     * @return {EventListener[]}
     */
    getEvents() {
        return this.events;
    }

}

module.exports = EventHandler;
