const { Collection } = require("discord.js");
const { EventEmitter } = require("events");
const ProtonHandler = require("../ProtonHandler");

class ListenerHandler extends ProtonHandler {
    constructor(client, options) {
        super(client, options);

        /** @type {Collection<string,EventEmitter>} */
        this.emitters = new Collection();

        this.setEmitter("client", this.client);
    }

    /**
     * 
     * @param {Listener} listener 
     * @param {string?} [filepath] 
     */
    register(listener, filepath) {
        super.register(listener, filepath);

        listener.execute = listener.execute.bind(listener);

        const emitter = this.emitters.get(listener.emitter);

        if (!emitter)
            throw new Error(`Emitter with id '${listener.emitter}' not found.`);

        if (listener.type === "once") {
            emitter.once(listener.event, listener.execute);
        } else if (listener.type === "on") {
            emitter.on(listener.event, listener.execute);
        }
    }

    /**
     * 
     * @param {Listener} listener 
     */
    deregister(listener) {
        super.deregister(listener);
        const emitter = this.emitters.get(listener.emitter);

        emitter.removeListener(listener.event, listener.execute);
    }

    /**
     * 
     * @param {string} id 
     * @param {EventEmitter} emitter 
     */
    setEmitter(id, emitter) {
        if (!(emitter instanceof EventEmitter))
            throw new TypeError("Emitter does not match EventEmitter.");

        this.emitters.set(id, emitter);
    }

    /**
     * 
     * @param {object} emitters 
     * @returns {this}
     */
    setEmitters(emitters) {
        for (const id in emitters) {
            this.setEmitter(id, emitters[id]);
        }
        return this;
    }

}

module.exports = ListenerHandler;

/**
 * @typedef {import("./Listener")} Listener
 */