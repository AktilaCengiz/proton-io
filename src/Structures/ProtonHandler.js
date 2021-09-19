/* eslint-disable new-cap */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

const { Collection } = require("discord.js");
const { EventEmitter } = require("events");
const readdir = require("../Utils/readdir");
const BaseModule = require("./ProtonModule");

class ProtonHandler extends EventEmitter {
    constructor(client, options = {}) {
        super();

        this.client = client;

        if (typeof options.directory !== "string") {
            throw new TypeError("The directory must be a type of string.");
        }

        this.directory = options.directory;

        this.modules = new Collection();
    }

    register(mod, filepath) {
        mod.client = this.client;
        mod.handler = this;
        mod.filepath = filepath;

        this.modules.set(mod.id, mod);

        return mod;
    }

    deregister(mod) {
        this.modules.delete(mod.id);

        if (typeof mod.filepath === "string")
            delete require.cache[require.resolve(mod.filepath)];

        return mod;
    }

    load(fileOrFn) {
        const isFile = typeof fileOrFn === "string";

        let mod = fileOrFn;

        if (isFile) {
            mod = require(fileOrFn);
        }

        if ((mod.prototype instanceof BaseModule)) {
            if (isFile) delete require.cache[require.resolve(fileOrFn)];
            return false;
        }

        mod = new mod(this.client);

        this.register(mod, isFile ? fileOrFn : null);

        return true;
    }

    loadAll() {
        const files = readdir(this.directory);

        for (let i = 0; i < files.length; i++) {
            this.load(files[i]);
        }

        return this;
    }
}

module.exports = ProtonHandler;
