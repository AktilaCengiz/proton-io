const { Collection } = require("discord.js");

/**
 * @template KT, VT
 */
class CachedManager {
    constructor() {
        /** @type {Collection<KT,VT>} */
        this.cache = new Collection();
    }

    /**
     * Register value to cache.
     * @param {KT} key - Key
     * @param {VT} value - Value
     * @returns
     */
    register(key, value) {
        this.cache.set(key, value);
        return this;
    }

    /**
     * Deregister key from cache.
     * @param {KT} key - Key
     * @returns {this}
     */
    deregister(key) {
        this.cache.delete(key);
        return this;
    }
}

module.exports = CachedManager;
