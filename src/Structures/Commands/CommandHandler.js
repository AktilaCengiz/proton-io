const ProtonHandler = require("../ProtonHandler");

class CommandHandler extends ProtonHandler {
    /**
     *
     * @param {ProtonClient} client
     * @param {CommandHandlerOptions & ProtonHandlerOptions} options
     */
    constructor(client, options) {
        super(client, options);

        /** @type {string!} */
        this.prefix = typeof options.prefix === "string"
            ? options.prefix
            : "!";

        /** @type {boolean} */
        this.ignoreSelf = typeof options.ignoreSelf === "boolean"
            ? options.ignoreSelf
            : true;

        /** @type {boolean} */
        this.ignoreBots = typeof options.ignoreBots === "boolean"
            ? options.ignoreBots
            : true;

        /** @type {number?} */
        this.defaultCooldown = typeof options.defaultCooldown === "function"
            ? options.defaultCooldown
            : null;
    }
}

module.exports = CommandHandler;

/**
 * @typedef {object} CommandHandlerOptions
 * @property {PrefixBuilder} [prefix="!"] - Prefix for commands.
 * @property {boolean} [ignoreSelf=true] - Whether the client should ignore itself.
 * @property {boolean} [ignoreBots=true] - Whether the client ignores bots.
 * @property {number} [defaultCooldown=null] - Default cooldown for commands.
 */

/**
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("../ProtonClient")} ProtonClient
 * @typedef {import("../ProtonHandler").ProtonHandlerOptions} ProtonHandlerOptions
 */

/**
 * @typedef {string | string[] | {(message:Message): string | string[]}} PrefixBuilder
 */
