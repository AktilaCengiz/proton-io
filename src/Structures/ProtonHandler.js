/* eslint-disable new-cap */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const { Collection } = require("discord.js");
const { EventEmitter } = require("events");
const readdir = require("../Utils/readdir");
const ProtonModule = require("./ProtonModule");

class ProtonHandler extends EventEmitter {
    /**
     *
     * @param {ProtonClient} client - ProtonClient.
     * @param {ProtonHandlerOptions} options - Options for the ProtonHandler.
     */
    constructor(client, options = {}) {
        super();

        this.client = client;

        if (typeof options.directory !== "string") {
            throw new TypeError("The directory must be a type of string.");
        }

        /** @type {string!} */
        this.directory = options.directory;

        /** @type {Collection<string, ProtonModule>} */
        this.modules = new Collection();
    }

    /**
     * It register the module in the cache.
     * @param {ProtonModule} mod - ProtonModule.
     * @param {?string} [filepath] - File path, if any.
     * @returns {ProtonModule}
     */
    register(mod, filepath) {
        // Add the "ProtonClient" property to the module.
        mod.client = this.client;
        // Add the "ProtonHandler" property to the module.
        mod.handler = this;
        // Add the "filepath" property to the module.
        mod.filepath = filepath;

        // Add module to cache.
        this.modules.set(mod.id, mod);

        return mod;
    }

    /**
     * It deregister the module from the cache.
     * @param {ProtonModule} mod - ProtonModule.
     * @returns {ProtonModule}
     */
    deregister(mod) {
        // Delete module from cache.
        this.modules.delete(mod.id);

        // If filepath is exist delete from require cache
        if (typeof mod.filepath === "string")
            delete require.cache[require.resolve(mod.filepath)];

        return mod;
    }

    /**
     * Loads the module.
     * @param {string | Function} fileOrFn - File path or module class.
     * @returns {boolean}
     */
    load(fileOrFn) {
        const isFile = typeof fileOrFn === "string";

        /** @type {*} */
        let mod = fileOrFn;

        // If it's a file, import it.
        if (isFile) {
            mod = require(fileOrFn);
        }

        // Return if the prototype does not match the ProtonModule.
        if ((mod.prototype instanceof ProtonModule)) {
            if (isFile) delete require.cache[require.resolve(fileOrFn)];
            return false;
        }

        // Create the module.
        mod = new mod(this.client);

        // Register the module.
        this.register(mod, isFile ? fileOrFn : null);

        return true;
    }

    /**
     * Loads the modules.
     * @returns {this}
     */
    loadAll() {
        // Read files from directory.
        const files = readdir(this.directory);

        // Load all files.
        for (let i = 0; i < files.length; i++) {
            this.load(files[i]);
        }

        return this;
    }

    /**
     * Reloads the module.
     * @param {string} id - The ID of the module to be reloaded.
     * @returns {ProtonModule}
     */
    reload(id) {
        // Get module.
        const mod = this.modules.get(id);

        // If there is no module, throw an error.
        if (!mod) {
            throw new Error(`The module with id '${id}' is not in the cache.`);
        }

        // Deregister module.
        this.deregister(mod);

        // Reload module.
        this.load(mod.filepath);

        return mod;
    }

    /**
     * Reloads the modules.
     * @returns {this}
     */
    reloadAll() {
        for (const mod of [...this.modules.values()]) {
            if (mod.filepath) this.reload(mod.id);
        }

        return this;
    }

    /**
     * Remove the module.
     * @param {string} id - The ID of the module to be reloaded.
     * @returns {ProtonModule}
     */
    remove(id) {
        // Get module.
        const mod = this.modules.get(id);

        // If there is no module, throw an error.
        if (!mod) {
            throw new Error(`The module with id '${id}' is not in the cache.`);
        }

        // Deregister module.
        this.deregister(mod);

        return mod;
    }

    /**
     * Remove the modules.
     * @returns {this}
     */
    removeAll() {
        for (const id of [...this.modules.keys()])
            this.remove(id);

        return this;
    }
}

module.exports = ProtonHandler;

/**
 * @typedef {object} ProtonHandlerOptions
 * @property {string} [directory] - Directory containing modules for the handler.
 */

/**
 * @typedef {import("./ProtonClient")} ProtonClient
 *
 */
