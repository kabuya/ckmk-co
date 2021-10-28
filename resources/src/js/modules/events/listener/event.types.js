let
    acceptedEvents = {}
;

/**
 * @property {string} typeID
 * @property {EventHandler} events
 */
class EventTypes {


    constructor() {
        this.typeID = co.generate(10, true, true, true, false);
        this.events = new co.event();
        acceptedEvents[this.typeID] = [];
    }

    /**
     * @param {string|string[]|array} events
     */
    addAcceptedEvents(events) {
        if(co.isArray(events)) {
            $.each(events, (k, event) => {
                if(acceptedEvents[this.typeID].indexOf(event) < 0) {
                    acceptedEvents[this.typeID].push(event);
                }
            });
        } else if(co.isString(events)) {
            if(acceptedEvents[this.typeID].indexOf(events) < 0) {
                acceptedEvents[this.typeID].push(events);
            }
        }
    }

    /**
     * @param {string} event
     * @return {boolean}
     */
    removeAcceptedEvents(event) {
        let
            index = acceptedEvents[this.typeID].indexOf(event)
        ;
        if(index) {
            if(acceptedEvents[this.typeID].splice(index, 1).length){
                return true;
            }
        }
        return false;
    }

    /**
     * @return {string[]}
     */
    getAcceptedEvents() {
        return acceptedEvents[this.typeID];
    }

    /**
     * @param {string} eventName
     * @param {Function|array} cb
     */
    on(eventName, cb) {
        if(this.isValidEventName(eventName)) {
            return this.events.listen(eventName, cb);
        }
        return false;
    }

    /**
     * @param {string} eventName
     * @param {Function|array} cb
     */
    onBefore(eventName, cb) {
        return this.events.beforeListen(eventName, cb);
    }

    /**
     * @param {string} eventName
     * @param {Function|array} cb
     */
    onAfter(eventName, cb) {
        return this.events.afterListen(eventName, cb);
    }

    /**
     * @param {string} eventName
     * @param {Function|array} cb
     * @return {boolean}
     */
    remove(eventName, cb) {
        return this.events.removeCallback(eventName, cb);
    }

    /**
     * @param {string} eventName
     * @param {Function|array} cb
     * @return {boolean}
     */
    removeBefore(eventName, cb) {
        return this.events.removeBeforeCallback(eventName, cb);
    }

    /**
     * @param {string} eventName
     * @param {Function|array} cb
     * @return {boolean}
     */
    removeAfter(eventName, cb) {
        return this.events.removeAfterCallback(eventName, cb);
    }

    /**
     * @param {string} eventName
     * @param args
     * @return {boolean}
     */
    run(eventName, ...args) {
        return this.events.exec(eventName, ...args);
    }

    /**
     * @param {string} eventName
     * @return {boolean}
     */
    kill(eventName) {
        return this.events.remove(eventName);
    }

    /**
     * @param {string} eventName
     * @return {boolean}
     */
    isValidEventName(eventName) {
        return (this.events.isValidName(eventName) && eventName.in(...acceptedEvents[this.typeID]));
    }

}

module.exports = EventTypes;