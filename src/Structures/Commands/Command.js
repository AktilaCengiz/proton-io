const ProtonModule = require("../ProtonModule");

class Command extends ProtonModule {
    /**
     *
     * @param {string} id - ID of the command.
     * @param {CommandOptions & ProtonModuleOptions} [options={}] - Command options.
     */
    constructor(id, options = {}) {
        super(id, options);

        /** @type {(string | string[])?} */
        this.aliases = typeof options.aliases === "string" || options.aliases instanceof Array
            ? options.aliases
            : null;

        /** @type {object[]?} */
        this.args = options.args instanceof Array
            ? options.args
            : null;

        /** @type {boolean!} */
        this.ownerOnly = typeof options.aliases === "boolean"
            ? options.ownerOnly
            : false;

        /** @type {boolean!} */
        this.advancedArgs = typeof options.advancedArgs === "boolean"
            ? options.advancedArgs
            : false;

        /** @type {number?} */
        this.cooldown = typeof options.cooldown === "number"
            ? options.cooldown
            : null;

        /** @type {object?} */
        this.information = typeof options.information === "object"
            ? options.information
            : null;

        /** @type {WhereRunning?} */
        this.whereRunning = typeof options.whereRunning === "string" || typeof options.whereRunning === "function"
            ? options.whereRunning
            : null;

        /** @type {(PermissionString | PermissionString[])?} */
        this.userPermissions = typeof options.userPermissions === "string" || options.userPermissions instanceof Array
            ? options.userPermissions
            : null;

        /** @type {(PermissionString | PermissionString[])?} */
        this.botPermissions = typeof options.botPermissions === "string" || options.botPermissions instanceof Array
            ? options.botPermissions
            : null;
    }
}

module.exports = Command;

/**
 * @typedef {object} CommandOptions
 * @property {string|string[]} [aliases=[]] - Command aliases.
 * @property {object[]} [args=null] - Required arguments for the command.
 * @property {boolean} [ownerOnly=false] - Usable only by the client owner.
 * @property {boolean} [advancedArgs=true] - Whether to use the advanced argument system.
 * @property {number} [cooldown=null] - Command cooldown.
 * @property {object} [information=null] - Command information object.
 * @property {WhereRunning} [whereRunning=null] - Where to run the command.
 * @property {PermissionString | PermissionString[]} [userPermissions=null] - Required permission(s) for the user to use the command.
 * @property {PermissionString | PermissionString[]} [botPermissions=null] - Required client permission(s) for the command.
 */

/**
 * @typedef {import("../ProtonModule").ProtonModuleOptions} ProtonModuleOptions
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("discord.js").PermissionString} PermissionString
 */

/**
 * @typedef {"dmChannel" | "guild" | {(message:Message): unknown}} WhereRunning
 */
