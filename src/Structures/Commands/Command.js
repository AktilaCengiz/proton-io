const {
    isString, isArray, isFunction, isBoolean, isNumber, isObject
} = require("../../Utils/Types");
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
        this.aliases = isString(options.aliases) || isArray(options.aliases)
            ? options.aliases
            : null;

        /** @type {boolean!} */
        this.ownerOnly = isBoolean(options.ownerOnly)
            ? options.ownerOnly
            : false;

        /** @type {number?} */
        this.cooldown = isNumber(options.cooldown)
            ? options.cooldown
            : null;

        /** @type {object?} */
        this.information = isObject(options.information)
            ? options.information
            : null;

        /** @type {(PermissionString | PermissionString[] | PermissionsRouter)?} */
        this.userPermissions = isString(options.userPermissions)
            || isFunction(options.userPermissions)
            || isArray(options.userPermissions)
            ? isFunction(options.userPermissions)
                // @ts-ignore
                ? options.userPermissions.bind(this)
                : options.userPermissions
            : null;

        /** @type {(PermissionString | PermissionString[] | PermissionsRouter)?} */
        this.clientPermissions = isString(options.clientPermissions)
            || isFunction(options.clientPermissions)
            || isArray(options.clientPermissions)
            ? isFunction(options.clientPermissions)
                // @ts-ignore
                ? options.clientPermissions.bind(this)
                : options.clientPermissions
            : null;

        /** @type {boolean!} */
        this.executable = isBoolean(options.executable)
            ? options.executable
            : true;

        /** @type {number?} */
        this.rateLimit = isNumber(options.rateLimit)
            ? options.rateLimit
            : null;

        /** @type {boolean?} */
        this.typing = isBoolean(options.typing)
            ? options.typing
            : null;
    }
}

module.exports = Command;

/**
 * @typedef {object} CommandOptions
 * @property {string|string[]} [aliases=[]] - Command aliases.
 * @property {boolean} [ownerOnly=false] - Usable only by the client owner.
 * @property {number} [cooldown=null] - Command cooldown.
 * @property {object} [information=null] - Command information object.
 * @property {PermissionString | PermissionString[] | PermissionsRouter} [userPermissions=null] - Required permission(s) for the user to use the command.
 * @property {PermissionString | PermissionString[] | PermissionsRouter} [clientPermissions=null] - Required client permission(s) for the command.
 * @property {boolean} [executable=true] - Whether the command is executable.
 * @property {number} [rateLimit=null] - Uses allowed before cooldown.
 * @property {boolean} [typing=null] - Whether or not to type during command execution.
 */

/**
 * @typedef {import("../ProtonModule").ProtonModuleOptions} ProtonModuleOptions
 * @typedef {import("./CommandHandler").PrefixRouter} PrefixRouter
 * @typedef {import("discord.js").Message} Message
 * @typedef {import("discord.js").PermissionString} PermissionString
 */

/**
 * @typedef {{ (message:Message): unknown } } PermissionsRouter
 */
