const { isString } = require("../../Utils/Types");
const ProtonModule = require("../ProtonModule");

/**
 * @extends {ProtonModule}
 */
class Listener extends ProtonModule {
    /**
     *
     * @param {string} id
     * @param {ListenerOptions & ProtonModuleOptions} options
     */
    constructor(id, options) {
        super(id, options);

        if (!isString(options?.emitter))
            throw new TypeError("The emitter must be of string type.");

        if (!isString(options?.event))
            throw new TypeError("The event must be of string type.");

        /** @type {string} */
        this.emitter = options.emitter;

        /** @type {string} */
        this.event = options.event;

        /** @type {string} */
        this.type = isString(options?.type)
            ? options.type
            : "on";
    }
}

module.exports = Listener;

/**
 * @typedef {import("../ProtonModule").ProtonModuleOptions} ProtonModuleOptions
 * @typedef {object} ListenerOptions
 * @property {string} emitter - The event emitter, either a key from ListenerHandler#emitters
 * @property {string} event - Event name to listen to.
 * @property {string} [type="on"] - Type of listener.
*/
