class ProtonModule {
    /**
     *
     * @param {string} id - ID of the module.
     * @param {ProtonModuleOptions} options - Options for the module.
     */
    constructor(id, options = {}) {
        if (typeof id !== "string") {
            throw new TypeError("The module ID must be a type of string.");
        }

        /** @type {string} */
        this.id = id;

        /** @type {string} */
        this.category = typeof options.category === "string"
            ? options.category
            : "default";

        /**
         * The module's client class.
         * @type {ProtonClient!}
         */
        this.client = null;

        /**
         * The module's handler class.
         * @type {ProtonHandler!}
         */
        this.handler = null;

        /**
         * The file path of the module, if any.
         * @type {string?}
         */
        this.filepath = null;
    }

    /**
     * Reload this module.
     * @returns {this}
     */
    reload() {
        if (this.handler)
            this.handler.reload(this.id);

        return this;
    }

    /**
     * Remove this module.
     * @returns {this}
     */
    remove() {
        if (this.handler)
            this.handler.remove(this.id);

        return this;
    }
}

module.exports = ProtonModule;

/**
 * @typedef {object} ProtonModuleOptions
 * @property {string} [category="default"] - Category of the module.
 */

/**
 * @typedef {import("./ProtonClient")} ProtonClient
 * @typedef {import("./ProtonHandler")} ProtonHandler
 */
