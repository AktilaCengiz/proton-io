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
        this.ownerOnly = typeof options.ownerOnly === "boolean"
            ? options.ownerOnly
            : false;

        /** @type {boolean?} */
        this.advancedArgs = typeof options.advancedArgs === "boolean"
            ? options.advancedArgs
            : null;

        /** @type {number?} */
        this.cooldown = typeof options.cooldown === "number"
            ? options.cooldown
            : null;

        /** @type {object?} */
        this.information = typeof options.information === "object"
            ? options.information
            : null;

        /** @type {(PermissionString | PermissionString[])?} */
        this.userPermissions = typeof options.userPermissions === "string" || options.userPermissions instanceof Array
            ? options.userPermissions
            : null;

        /** @type {(PermissionString | PermissionString[])?} */
        this.clientPermissions = typeof options.clientPermissions === "string" || options.clientPermissions instanceof Array
            ? options.clientPermissions
            : null;

        /** @type {boolean!} */
        this.executable = typeof options.executable === "boolean"
            ? options.executable
            : true;

        /** @type {number?} */
        this.rateLimit = typeof options.rateLimit === "number"
            ? options.rateLimit
            : null;

        /** @type {boolean?} */
        this.typing = typeof options.typing === "boolean"
            ? options.typing
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
 * @property {PermissionString | PermissionString[]} [userPermissions=null] - Required permission(s) for the user to use the command.
 * @property {PermissionString | PermissionString[]} [clientPermissions=null] - Required client permission(s) for the command.
 * @property {boolean} [executable=true] - Whether the command is executable.
 * @property {number} [rateLimit=null] - Uses allowed before cooldown.
 * @property {boolean} [typing=null] - Whether or not to type during command execution.
 */

/**
 * @typedef {import("../ProtonModule").ProtonModuleOptions} ProtonModuleOptions
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("discord.js").PermissionString} PermissionString
 */
